import dash
from dash import dcc, html, dash_table, Input, Output, State
from dash.dependencies import ALL  # Import ALL for pattern matching
import pandas as pd
import io
import base64
from sqlalchemy import create_engine, Table, MetaData

app = dash.Dash(__name__, suppress_callback_exceptions=True)

categories = [
    "first_name", "last_name", "email", "phone", "mobile_phone", "country",
    "company_name", "industry", "job_title", "linkedin_url", "company_size",
    "department", "other"
]

engine = create_engine('sqlite:///leads.db')
metadata = MetaData()
metadata.reflect(bind=engine)
leads_table = metadata.tables['leads']

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),  # Component to handle URLs
    html.Div(id='page-content'),  # Div to display page content based on URL
])

# Function to render the upload page
def render_upload_page(group_name):
    return html.Div([
        html.H2(f"CSV File Uploader for Group: {group_name}"),
        dcc.Upload(
            id='upload-data',
            children=html.Div([
                'Drag and Drop or ',
                html.A('Select Files')
            ]),
            style={
                'width': '100%',
                'height': '60px',
                'lineHeight': '60px',
                'borderWidth': '1px',
                'borderStyle': 'dashed',
                'borderRadius': '5px',
                'textAlign': 'center',
                'margin': '10px'
            },
            multiple=False
        ),
        html.Div(id='output-data-upload'),
        html.Button('Save to Database', id='save-button', n_clicks=0),
        html.Div(id='save-output'),
        dcc.Store(id='stored-group-name', data=group_name)  # Store the group name for later use
    ])

# Callback to update page content based on URL
@app.callback(
    Output('page-content', 'children'),
    [Input('url', 'pathname')]
)
def display_page(pathname):
    if pathname.startswith('/upload/'):
        group_name = pathname.split('/')[-1]  # Extract group name from URL
        return render_upload_page(group_name)
    else:
        return html.Div(['404 Page Not Found'])

def parse_contents(contents, filename):
    content_type, content_string = contents.split(',')
    decoded = base64.b64decode(content_string)
    try:
        if 'csv' in filename:
            df = pd.read_csv(io.StringIO(decoded.decode('utf-8')))
        else:
            return None
    except Exception as e:
        return None
    
    return df

@app.callback(
    Output('output-data-upload', 'children'),
    [Input('upload-data', 'contents')],
    [State('upload-data', 'filename')]
)
def update_output(contents, filename):
    if contents is not None:
        df = parse_contents(contents, filename)
        if df is not None:
            columns = df.columns.tolist()

            table_and_dropdowns = []
            
            for col in columns:
                column_div = html.Div([
                    html.H4(col),
                    dash_table.DataTable(
                        data=df[[col]].to_dict('records'),
                        columns=[{'name': col, 'id': col}],
                        style_table={'width': '40%', 'display': 'inline-block', 'verticalAlign': 'top'},
                        style_cell={'textAlign': 'left'}
                    ),
                    html.Div([
                        html.Label(f"Categorize '{col}':"),
                        dcc.Dropdown(
                            id={'type': 'category-dropdown', 'index': col},
                            options=[{'label': cat, 'value': cat} for cat in categories],
                            value="other"  
                        ),
                    ], style={'width': '40%', 'display': 'inline-block', 'verticalAlign': 'top', 'marginLeft': '5%'})
                ], style={'display': 'flex', 'marginBottom': '20px'})

                table_and_dropdowns.append(column_div)

            return html.Div(table_and_dropdowns)         
    
    return html.Div(['No file uploaded yet.'])

@app.callback(
    Output('save-output', 'children'),
    Input('save-button', 'n_clicks'),
    [State('upload-data', 'contents'), State('upload-data', 'filename'), State('stored-group-name', 'data')],
    [State({'type': 'category-dropdown', 'index': ALL}, 'value')]
)
def save_to_database(n_clicks, contents, filename, group_name, dropdown_values):
    if n_clicks > 0 and contents is not None:
        df = parse_contents(contents, filename)
        if df is not None:
            column_mapping = dict(zip(df.columns.tolist(), dropdown_values))
            data_to_insert = {category: df[col] for col, category in column_mapping.items() if category in leads_table.c}

            # Add the group name to each row in the dataframe
            data_to_insert['group_name'] = [group_name] * len(df)

            mapped_df = pd.DataFrame(data_to_insert)

            with engine.connect() as conn:
                mapped_df.to_sql('leads', con=conn, if_exists='append', index=False)

            return f"Successfully saved {len(mapped_df)} records to the database under group '{group_name}'."

    return ""

if __name__ == '__main__':
    app.run_server(debug=True)
