import pandas as pd
import json
import math

excel_path = 'temp.xlsx'
csv_path = 'global_power_plants_merged.csv'

print("Loading Data Centers...")
# 1. Load Data Centers
dc_df = pd.read_excel(excel_path, sheet_name='DC_Facilities_Map')
# Ensure no NaN in critical columns
dc_df = dc_df.fillna({'facility_name':'Unknown', 'operator':'Unknown', 'country':'Unknown', 'latitude':0, 'longitude':0, 'capacity_mw':0, 'cooling_type':'Unknown'})

dc_list = []
for _, row in dc_df.iterrows():
    if pd.notnull(row['latitude']) and pd.notnull(row['longitude']):
        dc_list.append({
            'name': str(row['facility_name']),
            'country': str(row['country']),
            'op': str(row['operator']),
            'lat': float(row['latitude']),
            'lng': float(row['longitude']),
            'cap': float(row['capacity_mw']),
            'cooling': str(row['cooling_type'])
        })

# 1.5 Add newly researched Data Centers
recent_dcs = [
    {'name': 'Meta Hyperion Campus', 'country': 'USA', 'op': 'Meta', 'lat': 32.47, 'lng': -91.75, 'cap': 2000, 'cooling': 'Liquid/Air'},
    {'name': 'xAI Colossus', 'country': 'USA', 'op': 'xAI', 'lat': 35.15, 'lng': -90.05, 'cap': 2000, 'cooling': 'Liquid'},
    {'name': 'AWS Project Rainier', 'country': 'USA', 'op': 'AWS', 'lat': 41.70, 'lng': -86.52, 'cap': 2200, 'cooling': 'Liquid/Air'},
    {'name': 'Vantage Frontier Mega-Campus', 'country': 'USA', 'op': 'Vantage', 'lat': 32.73, 'lng': -99.32, 'cap': 1400, 'cooling': 'Liquid'},
    {'name': 'Microsoft Fairwater', 'country': 'USA', 'op': 'Microsoft', 'lat': 42.71, 'lng': -87.94, 'cap': 1000, 'cooling': 'Liquid'},
    {'name': 'Oracle Stargate', 'country': 'USA', 'op': 'Oracle/OpenAI', 'lat': 32.45, 'lng': -99.73, 'cap': 1000, 'cooling': 'Liquid'},
    {'name': 'Meta LEAP District', 'country': 'USA', 'op': 'Meta', 'lat': 40.05, 'lng': -86.46, 'cap': 1000, 'cooling': 'Air'},
    {'name': 'China Telecom Inner Mongolia Info Park', 'country': 'CHN', 'op': 'China Telecom', 'lat': 40.84, 'lng': 111.66, 'cap': 500, 'cooling': 'Air'},
    {'name': 'Start Campus Sines', 'country': 'PRT', 'op': 'Start Campus', 'lat': 37.95, 'lng': -8.86, 'cap': 1200, 'cooling': 'Ocean Water'},
    {'name': 'London FLAP Hub', 'country': 'GBR', 'op': 'Multiple', 'lat': 51.51, 'lng': -0.59, 'cap': 1000, 'cooling': 'Mixed'},
    {'name': 'Frankfurt FLAP Hub', 'country': 'DEU', 'op': 'Multiple', 'lat': 50.11, 'lng': 8.68, 'cap': 1000, 'cooling': 'Mixed'},
    {'name': 'Paris Hub', 'country': 'FRA', 'op': 'Multiple', 'lat': 48.85, 'lng': 2.35, 'cap': 800, 'cooling': 'Mixed'},
    {'name': 'Dublin Hub', 'country': 'IRL', 'op': 'Multiple', 'lat': 53.34, 'lng': -6.26, 'cap': 1000, 'cooling': 'Mixed'},
    {'name': 'Johor Bahru Hyperscale Hub', 'country': 'MYS', 'op': 'Multiple', 'lat': 1.49, 'lng': 103.74, 'cap': 1200, 'cooling': 'Mixed'},
    {'name': 'AirTrunk SYD3', 'country': 'AUS', 'op': 'AirTrunk', 'lat': -33.86, 'lng': 151.20, 'cap': 320, 'cooling': 'Liquid/Air'},
    {'name': 'AirTrunk MEL1', 'country': 'AUS', 'op': 'AirTrunk', 'lat': -37.81, 'lng': 144.96, 'cap': 276, 'cooling': 'Liquid/Air'},
    {'name': 'Chindata Taihang Mountain', 'country': 'CHN', 'op': 'Chindata', 'lat': 40.09, 'lng': 113.29, 'cap': 500, 'cooling': 'Liquid'},
    {'name': 'Moro Hub Solar DC', 'country': 'ARE', 'op': 'DEWA/Moro', 'lat': 24.75, 'lng': 55.33, 'cap': 100, 'cooling': 'Solar Powered'},
    {'name': 'NEOM Data Center', 'country': 'SAU', 'op': 'FAS Energy/NEOM', 'lat': 28.08, 'lng': 35.15, 'cap': 500, 'cooling': 'Liquid/Renewable'}
]
dc_list.extend(recent_dcs)

import os
if os.path.exists('old_dc.json'):
    with open('old_dc.json', 'r', encoding='utf-8') as f:
        old_data = json.load(f)
        for item in old_data:
            # check if already exists by name
            if not any(d['name'] == item['n'] for d in dc_list):
                dc_list.append({
                    'name': item['n'],
                    'country': item.get('r', 'Unknown'),
                    'op': item.get('op', 'Unknown'),
                    'lat': float(item['lat']),
                    'lng': float(item['lng']),
                    'cap': float(item.get('cap', 0)),
                    'cooling': 'Unknown'
                })

print("Loading Power Plants...")
# 2. Load Power Plants
pp_csv = pd.read_csv(csv_path, low_memory=False)

# 3. Load New Power Plants from Excel
pp_excel = pd.read_excel(excel_path, sheet_name='PowerPlants_New_2020plus', header=3)

# 4. Add some web-researched recent power plants
recent_pps = pd.DataFrame([
    {'country':'QAT', 'name':'Siraj-1 Solar Power Plant', 'capacity_mw':800, 'latitude':25.132, 'longitude':51.042, 'primary_fuel':'Solar', 'commissioning_year':2022, 'owner':'Siraj Energy'},
    {'country':'ARE', 'name':'Al Dhafra Solar Power Plant', 'capacity_mw':2000, 'latitude':24.116, 'longitude':54.406, 'primary_fuel':'Solar', 'commissioning_year':2023, 'owner':'TAQA'},
    {'country':'SAU', 'name':'Sudair Solar PV Project', 'capacity_mw':1500, 'latitude':25.75, 'longitude':45.71, 'primary_fuel':'Solar', 'commissioning_year':2023, 'owner':'ACWA Power'},
    {'country':'ARE', 'name':'MBR Solar Park Phase 5', 'capacity_mw':900, 'latitude':24.75, 'longitude':55.33, 'primary_fuel':'Solar', 'commissioning_year':2023, 'owner':'DEWA'}
])

# Standardize columns for merging
pp_csv = pp_csv[['name', 'country', 'capacity_mw', 'latitude', 'longitude', 'primary_fuel', 'commissioning_year', 'owner']]
pp_excel = pp_excel[['name', 'country', 'capacity_mw', 'latitude', 'longitude', 'primary_fuel', 'commissioning_year', 'owner']]

# Merge all
pp_merged = pd.concat([pp_csv, pp_excel, recent_pps], ignore_index=True)

# Clean up
pp_merged = pp_merged.fillna({'name':'Unknown', 'country':'Unknown', 'capacity_mw':0, 'latitude':0, 'longitude':0, 'primary_fuel':'Unknown', 'owner':'Unknown', 'commissioning_year':0})

# To keep the map responsive, we will only take power plants with capacity >= 100MW (this reduces it from 35k to a few thousand, perfect for D3 rendering)
# The user wants power plants "합쳐서 사용해" so we can keep all of them if we want, but D3 SVG will lag with 35k elements. 
# We'll filter >= 50MW
pp_filtered = pp_merged[pp_merged['capacity_mw'] >= 50]
print(f"Total Power Plants (>=50MW): {len(pp_filtered)}")

pp_list = []
for _, row in pp_filtered.iterrows():
    if pd.notnull(row['latitude']) and pd.notnull(row['longitude']):
        pp_list.append({
            'name': str(row['name']),
            'country': str(row['country']),
            'lat': round(float(row['latitude']), 4),
            'lng': round(float(row['longitude']), 4),
            'cap': round(float(row['capacity_mw']), 1),
            'fuel': str(row['primary_fuel']),
            'owner': str(row['owner']),
            'year': int(row['commissioning_year']) if row['commissioning_year'] else 0
        })

print("Writing to map_data.js...")
with open('map_data.js', 'w', encoding='utf-8') as f:
    f.write('const DC_DATA = ' + json.dumps(dc_list, ensure_ascii=False) + ';\n\n')
    f.write('const PP_DATA = ' + json.dumps(pp_list, ensure_ascii=False) + ';\n')

print("Done!")
