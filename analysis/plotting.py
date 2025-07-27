import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Data for each dataset

# 1. Percentage of Passwords containing attribute
categories_contains = ['Name', 'Word', 'Year', 'Random']
contains_1 = [32.2, 59.1, 2.6, 12.2]
contains_2 = [31.3, 60.1, 3.5, 11.3]
contains_3 = [25.2, 60.1, 9.6, 18.3]
contains_4 = [23.5, 51.3, 8.7, 25.2]
contains_total = [28.0, 58.0, 6.1, 16.7]

# 2. Percentage Distribution of Characters (only top 5 for example)
categories_chars = ['1', '!', '$', '@', '0', '3', '123', '#', '5', '?', '4', '100','*']
chars_1 = [3.5, 0.9, 4.3, 4.3, 3.5, 1.7, 0.9, 1.7, 1.7, 0.9, 0.0, 0.9, 0.9]
chars_2 = [1.7, 1.7, 3.5, 2.6, 2.6, 2.6, 2.6, 0.9, 1.7, 0.9, 0.0, 0.9, 0.0]
chars_3 = [20.0, 1.7, 5.2, 5.2, 9.6, 10.4, 7.8, 0.9, 4.3, 0.9, 4.3, 3.5, 0.9]
chars_4 = [19.1, 37.4, 23.5, 21.7, 12.2, 7.8, 9.6, 7.0, 1.7, 7.0, 4.3, 3.5, 7.0]
chars_total = [11.1, 10.4, 9.1, 8.5, 7.0, 5.7, 5.2, 2.6, 2.4, 2.4, 2.2, 2.2, 2.2]

# 3. Percentage Distribution of Special Character Positions
categories_pos_spec = [
    'First Char', 'Second Char', 'Third Char', 'Fourth Char', 'Fifth Char',
    'Middle Char', '5th-to-Last', '4th-to-Last', '3rd-to-Last',
    '2nd-to-Last', 'Last Char'
]
spec_1 = [1.7, 3.5, 1.7, 0.9, 0.0, 0.9, 0.0, 0.9, 0.0, 1.7, 4.4]
spec_2 = [1.7, 0.9, 0.9, 0.0, 0.0, 0.9, 0.9, 0.9, 0.0, 1.7, 4.4]
spec_3 = [1.7, 1.7, 0.9, 0.9, 0.0, 0.9, 0.0, 1.7, 0.9, 3.5, 5.2]
spec_4 = [6.1, 4.4, 2.6, 2.6, 0.9, 2.6, 0.9, 6.1, 12.2, 20.0, 67.0]
spec_total = [2.8, 2.6, 1.5, 1.1, 0.2, 1.3, 0.4, 2.4, 3.3, 6.7, 20.2]

# 4. Percentage Distribution of Uppercase character locations
categories_pos_upper = ['Pos1', 'Pos2', 'Pos3', 'Pos4', 'Pos5', 'Pos6', 'Pos7', 'Pos8', 'Pos9', 'Pos10', 'Pos11', 'Pos12', 'Pos13', 'Pos14', 'Pos15']
upper_1 = [43.5, 3.5, 4.3, 4.3, 3.5, 3.5, 3.5, 1.7, 0.9, 1.7, 0.9, 0.9, 1.7, 0.9, 0.9]
upper_2 = [92.2, 8.7, 13.0, 11.3, 9.6, 7.0, 8.7, 5.2, 2.6, 2.6, 1.7, 0.9, 0.9, 0.0, 0.0]
upper_3 = [90.4, 7.8, 9.6, 9.6, 8.7, 7.8, 6.1, 5.2, 4.3, 5.2, 1.7, 2.6, 0.9, 1.7, 0.9]
upper_4 = [87.0, 9.6, 10.4, 11.3, 10.4, 9.6, 7.8, 6.1, 2.6, 4.3, 1.7, 1.7, 1.7, 1.7, 0.9]
upper_total = [78.3, 7.4, 9.3, 9.1, 8.0, 7.0, 6.5, 4.6, 2.6, 3.5, 1.5, 1.5, 1.3, 1.1, 0.7]

# 5. Distribution of Uppercase character Positions
categories_pos_upper_loc = [
    'First Char', 'Second Char', 'Third Char', 'Fourth Char', 'Fifth Char',
    'Middle Char', '5th-to-Last', '4th-to-Last', '3rd-to-Last',
    '2nd-to-Last', 'Last Char'
]
upper_loc_1 = [43.5, 3.5, 4.3, 4.3, 3.5, 3.5, 3.5, 1.7, 0.9, 1.7, 0.9, 0.9, 1.7, 0.9, 0.9]
upper_loc_2 = [92.2, 8.7, 13.0, 11.3, 9.6, 7.0, 8.7, 5.2, 2.6, 2.6, 1.7, 0.9, 0.9, 0.0, 0.0]
upper_loc_3 = [90.4, 7.8, 9.6, 9.6, 8.7, 7.8, 6.1, 5.2, 4.3, 5.2, 1.7, 2.6, 0.9, 1.7, 0.9]
upper_loc_4 = [87.0, 9.6, 10.4, 11.3, 10.4, 9.6, 7.8, 6.1, 2.6, 4.3, 1.7, 1.7, 1.7, 1.7, 0.9]
upper_loc_total = [78.3, 7.4, 9.3, 9.1, 8.0, 7.0, 6.5, 4.6, 2.6, 3.5, 1.5, 1.5, 1.3, 1.1, 0.7]


# Create subplot figure with 4 rows (one per dataset)
fig = make_subplots(rows=4, cols=1, subplot_titles=(
    'Percentage of Passwords containing attribute',
    # 'Percentage Distribution of Characters',
    # 'Percentage Distribution of Special Character Positions',
    # 'Percentage Distribution of Uppercase character locations',
    # 'Distribution of Uppercase character Positions',
))

def add_trace(fig, row, y, name, x):
    fig.add_trace(go.Bar(name=name, x=x, y=y), row=row, col=1)

# Add traces for each dataset
for name, data in zip(['#1', '#2', '#3', '#4', 'Total'], [contains_1, contains_2, contains_3, contains_4, contains_total]):
    add_trace(fig, 1, data, name, categories_contains)

# for name, data in zip(['#1', '#2', '#3', '#4', 'Total'], [chars_1, chars_2, chars_3, chars_4, chars_total]):
#     add_trace(fig, 1, data, name, categories_chars)

# for name, data in zip(['#1', '#2', '#3', '#4', 'Total'], [spec_1, spec_2, spec_3, spec_4, spec_total]):
#     add_trace(fig, 1, data, name, categories_pos_spec)

# for name, data in zip(['#1', '#2', '#3', '#4', 'Total'], [upper_1, upper_2, upper_3, upper_4, upper_total]):
#     add_trace(fig, 1, data, name, categories_pos_upper)

# for name, data in zip(['#1', '#2', '#3', '#4', 'Total'], [upper_loc_1, upper_loc_2, upper_loc_3, upper_loc_4, upper_loc_total]):
#     add_trace(fig, 1, data, name, categories_pos_upper_loc)

fig.update_layout(xaxis_title="Positions", yaxis_title="Percentage (%)", height=1400, width=900, barmode='group')
fig.show()
