import dash
import dash_bootstrap_components as dbc  # New
from dash import dcc, html, dash_table, Input, Output, State
from dash.dependencies import ALL  # Import ALL for pattern matching
import pandas as pd
import io
import base64
from sqlalchemy import create_engine, Table, MetaData

# Initialize the app with Bootstrap theme
app = dash.Dash(__name__, suppress_callback_exceptions=True, external_stylesheets=[dbc.themes.BOOTSTRAP])

categories = [
    "first_name", "last_name", "email", "phone", "mobile_phone", "country",
    "company_name", "industry", "job_title", "linkedin_url", "company_size",
    "department", "other"
]

# Initialize the database engine and reflect the tables
engine = create_engine('sqlite:///leads.db')
metadata = MetaData()
metadata.reflect(bind=engine)
leads_table = metadata.tables['leads']

# Layout for the app
app.layout = dbc.Container([  # Use Bootstrap container for better layout management
    dcc.Location(id='url', refresh=False),  # Component to handle URLs
    html.Div(id='page-content'),  # Div to display page content based on URL
], fluid=True)

# Function to render the upload page
def render_upload_page(group_name):
    return dbc.Container([  # Use Bootstrap container for better layout management
        dbc.Row(dbc.Col(html.H2(f"CSV File Uploader for Group: {group_name}"), className="text-center mb-4")),  # Center and space title
        dbc.Row(
            dbc.Col(
                dcc.Upload(
                    id='upload-data',
                    children=html.Div([
                        'Drag and Drop or ',
                        html.A('Select Files', style={"color": "#007bff", "cursor": "pointer"})  # Styled link
                    ]),
                    style={
                        'width': '100%',
                        'height': '80px',
                        'lineHeight': '80px',
                        'borderWidth': '2px',
                        'borderStyle': 'dashed',
                        'borderRadius': '10px',
                        'textAlign': 'center',
                        'margin': '20px 0',
                        'backgroundColor': '#f9f9f9'
                    },
                    multiple=False
                ), width=12
            )
        ),
        html.Div(id='output-data-upload', className='mt-4'),
        dbc.Row(
            dbc.Col(
                dbc.Button("Save to Database", id='save-button', color="primary", className="mt-4", n_clicks=0),
                width=12, className="text-center"
            )
        ),
        html.Div(id='save-output', className='mt-4 text-center'),
        dcc.Store(id='stored-group-name', data=group_name)  # Store the group name for later use
    ], fluid=True)

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
        return dbc.Container([html.H2('404 Page Not Found', className="text-center")], fluid=True)

def parse_contents(contents, filename):
    content_type, content_string = contents.split(',')
    decoded = base64.b64decode(content_string)
    try:
        if 'csv' in filename:
            df = pd.read_csv(io.StringIO(decoded.decode('utf-8')))
        else:
            return None
    except Exception as e:
        print(f"Error parsing file: {e}")
        return None
    
    return df

# Callback to display uploaded data with column headers
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
                # We display the column name as a header inside the data table
                column_div = dbc.Row([
                    dbc.Col(dash_table.DataTable(
                        data=df[[col]].to_dict('records'),
                        columns=[{'name': col, 'id': col}],  # Display column header
                        style_table={'width': '100%', 'height': 'auto'},
                        style_header={'fontWeight': 'bold'},  # Make header bold
                        style_cell={'textAlign': 'left'}
                    ), width=8),  # Adjust the table width
                    dbc.Col(dcc.Dropdown(
                        id={'type': 'category-dropdown', 'index': col},
                        options=[{'label': cat, 'value': cat} for cat in categories],
                        value="other"
                    ), width=4)  # Adjust the dropdown width
                ], className="mb-4")

                table_and_dropdowns.append(column_div)

            return html.Div(table_and_dropdowns)
    
    return html.Div(['No file uploaded yet.'], className="text-center mt-4")

# Callback to handle saving to the database
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

            try:
                with engine.connect() as conn:
                    mapped_df.to_sql('leads', con=conn, if_exists='append', index=False)

                return dbc.Alert(f"Successfully saved {len(mapped_df)} records to the database under group '{group_name}'.", color="success")
            except Exception as e:
                return dbc.Alert(f"Error saving to database: {e}", color="danger")

    return ""

if __name__ == '__main__':
    app.run_server(debug=True)
