from flask import Flask, request, make_response, Request, jsonify
from flask_cors import CORS, cross_origin
import afmformats 
import json
import io
import numpy

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app, resources={r"/send_data": {"origins": "*"}})

@app.route('/')

def index():
    return 'Flask backend is running'

@app.route('/send_data', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type,Authorization'])
def send_data():
 #   response = make_response('Data received')
    
  #  response.headers['Access-Control-Allow-Origin'] = '*'
  #  response.headers['Access-Control-Allow-Methods'] = 'POST'
  #  response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
  #  response.headers = {'Content-Type': 'application/json'} 
    file = request.files['file']


    file.save('temp.jpk-force-map')
    data = afmformats.load_data('temp.jpk-force-map')
    
    customerData = {"Name": [], "Time": [], "Load": [], "Indentation": [], "Cantilever": [], "Piezo": []}
    customerData['Name'].append("test")

    # customerData['Time'].append(data[1]['time'].tolist())
    # customerData['Load'].append(data[1]['force'].tolist())
    # customerData['Piezo'].append(data[1]['height (piezo)'].tolist())
    # customerData['Indentation'].append(data[1]['height (measured)'].tolist())
    # customerData['Cantilever'].append(data[1]['segment'].tolist())


    for i in range(len(data)):
        customerData['Time'].append(data[i]['time'].tolist())
        customerData['Load'].append(data[i]['force'].tolist())
        customerData['Piezo'].append(data[i]['height (piezo)'].tolist())
        customerData['Indentation'].append(data[i]['height (measured)'].tolist())
        customerData['Cantilever'].append(data[i]['segment'].tolist())

    customerData['Time'] = [item for sublist in customerData['Time'] for item in sublist]
    customerData['Load'] = [item for sublist in customerData['Load'] for item in sublist]
    customerData['Piezo'] = [item for sublist in customerData['Piezo'] for item in sublist]
    customerData['Indentation'] = [item for sublist in customerData['Indentation'] for item in sublist]
    customerData['Cantilever'] = [item for sublist in customerData['Cantilever'] for item in sublist]

    print(type(customerData['Time'][0]))
    print(type(customerData['Load'][0]))
    print(type(customerData['Piezo'][0]))
    print(type(customerData['Indentation'][0]))
    print(type(customerData['Cantilever'][0]))
    print(type(customerData))
    
    
    
    headers = {'Content-Type': 'application/json'}

    customerDataJson = json.dumps(customerData)
   # print(type(customerDataJson))  
    return jsonify(customerData)

if __name__ == '__main__':
    app.run(debug=True)

