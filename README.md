# Team Organisation
### Team Members

- **Alex Markopoulou** -    2550454m@student.gla.ac.uk
- **Raphael Nekam** - 2575686n@student.gla.ac.uk

- **Kyle Watt** - 2555811w@student.gla.ac.uk

- **Marina San Jose Pena** - 2569221s@student.gla.ac.uk

- **Djan Tanova** - 2542341t@student.gla.ac.uk

- **Anthony Rainey** - 2506467r@student.gla.ac.uk

- **Alexander Lake** - 2576885l@student.gla.ac.uk
***
### Team Coach
- **Tim Storer** - Timothy.Storer@glasgow.ac.uk

# Getting Started

### 1.-Install NodeJS

You can download the executable through the website: https://nodejs.org/en/download/. For Windows, we recommend installing the .mpi file and for MacOS, the .pkg. For Linux OS, 
Node.js has a guide for each Linux distribution1: https://github.com/nodesource/distributions/blob/master/README.md. 

Run the executable to start the installation process.

After that is finished, you can run the following commands in the terminal to check that the installation has been successful.

To check the node version:
```console
foo@bar:~$ Node -v
v14.15.0
```

To check the npm version:

```console
foo@bar:~$ npm -v
6.14.8
```

If you already have Node.js installed, you can update it with the following terminal command:

```console
foo@bar:~$ npm install -g npm@latest
```

### 2.- Install Angular 15 CLI

You can use the Angular client to aid with the installation.
```console
foo@bar:~$ npm install -g @angular/cli@15
```

### 3.- Install remaining dependencies
There is a package.json file that holds the dependencies used. To install them, navigate to the folder /ese2-main/nanoindentation-dashboard/ and run npm install.

```console
foo@bar:~$ cd /ese2-main/nanoindentation-dashboard/
foo@bar:~$ npm install
```

### 4.- Build application

To build and serve the application:
```console
foo@bar:~$ ng serve
```
The page can be visited on http://localhost:4200/.

### 5.- Run Backend

The backend is built on Flask and is used for the AFMFormats library. 

Run the Server.py file in the root directory of the project. This will enable the backend which is required for the processing of AFMFormats.

```console
foo@bar:~$ python server.py
```
