from flask import Flask, request, make_response, Request, jsonify
from flask_cors import CORS, cross_origin
import afmformats 
import json
import io
import numpy as np

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
CORS(app, resources={r"/send_data": {"origins": "*"}})

@app.route('/')

def index():
    return 'Flask backend is running'

@app.route('/send_data', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type,Authorization'])

def send_data():
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
  
    headers = {'Content-Type': 'application/json'}
    
    
    return jsonify(customerData)

@app.route('/send_data_txt', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type,Authorization'])
def send_data_txt():
    file = request.files['file']
    file.save('temp.txt')
    f = open('temp.txt',encoding='latin1')
    stopLine = 'Time (s)'
    numeric = False
    data = []
    customerData = {'Name': [], 'Time': [], 'Load': [], 'deflection': [], 'Indentation': [], 'z': []}
    customerData['Name'].append("Test")
    for riga in f:
        if numeric is False:
            if riga[0:len(stopLine)] == stopLine:
                numeric = True
        else:
            line = riga.strip().replace(',', '.').split('\t')
            # Time (s)	Load (uN)	Indentation (nm)	Cantilever (nm)	Piezo (nm)	Auxiliary
            # skip 2 = indentation and #5 auxiliary if present
            data.append([float(line[0]), float(line[1]),
                            float(line[3]), float(line[4]),float(line[2])])
    f.close()
    data = np.array(data)
    max_index_indentation = data[:, 2].argmax()
    max_index_load = data[:, 1].argmax()
    max_index = max(max_index_indentation, max_index_load)
    data = data[:max_index+1, :]
    customerData['Time'] = data[:, 0]
    customerData['Load'] = data[:, 1]*1000
    customerData['deflection'] = data[:, 2]
    customerData['z'] = data[:, 3]
    customerData['Indentation'] = data[:, 4]


    customerData['Time'] = customerData['Time'].tolist()
    customerData['Load'] = customerData['Load'].tolist()
    customerData['deflection'] = customerData['deflection'].tolist()
    customerData['z'] = customerData['z'].tolist()
    customerData['Indentation'] = customerData['Indentation'].tolist()

   

    # data = np.loadtxt('temp.txt')
   

    # check = np.abs(np.mean(data[:100, 1])*1e9)
    # if check < 1000:
    #     customerData['force'] = data[:, 1]*1e9
    # else:
    #     customerData['force'] = data[:, 1] 
    #     customerData['z'] = data[:, 0]*1e9



  
    print("TEST!!!")

    customerDataJson = json.dumps(customerData)
   # print(type(customerDataJson))  
    return customerDataJson

if __name__ == '__main__':
    app.run(debug=True)



# file = request.files['file']

#     print("TESTING1")
#     file.save('temp.txt')
    
    
#     customerData = {"Name": [], "Time": [], "Load": [], "Indentation": [], "Cantilever": [], "Piezo": []}
#     customerData['Name'].append("test")
    
#     f = open('temp.txt',encoding='latin1')
#     stopLine = 'Time (s)'
#     numeric = False
#     data = []
#     for riga in f:
#         if numeric is False:
#             if riga[0:len(stopLine)] == stopLine:
#                 numeric = True
#         else:
#             line = riga.strip().replace(',', '.').split('\t')
#             # Time (s)	Load (uN)	Indentation (nm)	Cantilever (nm)	Piezo (nm)	Auxiliary
#             # skip 2 = indentation and #5 auxiliary if present
#             data.append([float(line[0]), float(line[1]),
#                             float(line[3]), float(line[4]),float(line[2])])
#     f.close()
    

#     max_indentation = max([inner_list[2] for inner_list in data]) # get maximum value in Indentation column
#     data_filtered = [inner_list for inner_list in data if inner_list[2] <= max_indentation] # filter data to only include values until max Indentation is reached

#     customerData['Time'] = [inner_list[0] for inner_list in data_filtered]
#     customerData['Load'] = [inner_list[1] * 10000 for inner_list in data_filtered]
#     customerData['Indentation'] = [inner_list[2] for inner_list in data_filtered]
#     customerData['Cantilever'] = [inner_list[3] for inner_list in data_filtered]
#     customerData['Piezo'] = [inner_list[4] for inner_list in data_filtered]

#     print(len(customerData['Indentation']))
  

#     print(len(customerData['Load']))
#     headers = {'Content-Type': 'application/json'}