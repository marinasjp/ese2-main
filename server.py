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

  

    for i in range(len(data)-1):
        fd = afmformats.mod_force_distance.AFMForceDistance(
            data[i]._raw_data, data[i].metadata, diskcache=False)
        customerData['Time'].append(0)   #data[i]['time'].tolist())
        customerData['Load'].append((fd.appr['force']*1e9).tolist() + (fd.retr['force']*1e9).tolist())
        customerData['Piezo'].append(0)   #[i]['height (piezo)'].tolist())
        
        customerData['Indentation'].append((-1*(fd.appr['height (measured)']*1e9)).tolist() + (-1*(fd.retr['height (measured)']*1e9).tolist()))
        customerData['Cantilever'].append(0)   #data[i]['segment'].tolist())

   
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

