import dash
from dash import dcc, html, dash_table, Input, Output, State, ctx
import pandas as pd
import io
import base64
import sqlite3
import os

# Initialize the app
app = dash.Dash(__name__)

# Define relevant columns that match the database schema
relevant_columns = [
    'first_name', 'last_name', 'email', 'company_name', 'country', 
    'job_title', 'mobile_phone', 'phone', 'linkedin_url', 
    'industry', 'department', 'company_size'
]

# Include "Other" as a category to ignore non-relevant columns
categories = relevant_columns + ['Other']

app.layout = html.Div([
    html.H2("CSV File Uploader"),
    
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
    html.Button('Submit', id='submit-button', n_clicks=0),
    html.Div(id='submission-status')
])

def parse_contents(contents, filename):
    content_type, content_string = contents.split(',')
    decoded = base64.b64decode(content_string)
    try:
        if 'csv' in filename:
            df = pd.read_csv(io.StringIO(decoded.decode('utf-8')))
        else:
            print("Unsupported file format.")
            return None
    except Exception as e:
        print(f"Error parsing file: {e}")
        return None
    
    return df

@app.callback(
    Output('output-data-upload', 'children'),
    [Input('upload-data', 'contents')],
    [State('upload-data', 'filename')]
)
def display_columns(contents, filename):
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
                        html.Label(f"Map '{col}' to:"),
                        dcc.Dropdown(
                            id=f'category-dropdown-{col}',
                            options=[{'label': cat, 'value': cat} for cat in categories],
                            value='Other',  # Default value is 'Other'
                            clearable=False
                        ),
                    ], style={'width': '40%', 'display': 'inline-block', 'verticalAlign': 'top', 'marginLeft': '5%'})
                ], style={'display': 'flex', 'marginBottom': '20px'})

                table_and_dropdowns.append(column_div)

            return html.Div(table_and_dropdowns)
    
    return html.Div(['No file uploaded yet.'])

@app.callback(
    [Output({'type': 'category-dropdown', 'index': dash.dependencies.ALL}, 'options')],
    [Input({'type': 'category-dropdown', 'index': dash.dependencies.ALL}, 'value')],
    [State({'type': 'category-dropdown', 'index': dash.dependencies.ALL}, 'id')]
)
def update_dropdown_options(selected_values, ids):
    # Disable options that have already been selected
    selected_values = [val for val in selected_values if val != 'Other']
    new_options = [
        [
            {'label': cat, 'value': cat, 'disabled': cat in selected_values} 
            for cat in categories
        ] for _ in ids
    ]
    return new_options
@app.callback(
    Output('submission-status', 'children'),
    [Input('submit-button', 'n_clicks')],
    [State('upload-data', 'contents'),
     State('upload-data', 'filename')] +
    [State({'type': 'category-dropdown', 'index': dash.dependencies.ALL}, 'value')]
)
def process_and_submit_data(n_clicks, contents, filename, selected_categories):
    if n_clicks > 0 and contents is not None:
        df = parse_contents(contents, filename)
        if df is not None:
            # Make sure selected_categories align with the columns in the df
            selected_categories = [cat.lower() for cat in selected_categories]

            # Initialize an empty DataFrame to collect valid columns
            filtered_df = pd.DataFrame()

            for i, category in enumerate(selected_categories):
                if category in relevant_columns:
                    filtered_df[category] = df.iloc[:, i]

            # Debugging: Output the DataFrame
            print("Filtered DataFrame to be Inserted:")
            print(filtered_df.head())

            # If the DataFrame is empty, there's an issue with the mappings
            if filtered_df.empty:
                print("Filtered DataFrame is empty after processing.")
                return "Error: No valid data to insert after processing."

            # Insert the data into the database
            insert_into_db(filtered_df)

            return "Data has been processed and inserted into the database."

    return "No file uploaded yet or no submission made."

def insert_into_db(df):
    # Check if the database exists in the current directory
    if not os.path.exists('leads.db'):
        print("Database not found! Ensure 'leads.db' is in the current directory.")
        return

    # Connect to SQLite database
    conn = sqlite3.connect('leads.db')
    cursor = conn.cursor()

    # Insert each row into the database, allowing for NULLs where data is missing
    for _, row in df.iterrows():
        try:
            cursor.execute('''
                INSERT INTO leads (first_name, last_name, email, company_name, country, job_title, 
                mobile_phone, phone, linkedin_url, industry, department, company_size)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', tuple(row.get(col, None) for col in relevant_columns))
        except Exception as e:
            print(f"Error inserting row: {e}")
    
    conn.commit()
    conn.close()

    print("Data successfully inserted into the database.")

if __name__ == '__main__':
    app.run_server(debug=True)
