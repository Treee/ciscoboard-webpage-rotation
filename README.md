# ciscoboard-webpage-rotation

## About

This package is meant to be used as a work aroudn to the cisco board limitation of only 1 url allowed. The local server will perform the following:

- Start on port **3000**
- Invoke Dexter job to screenshot AppDynamics application flow maps
- Move files around in order to server them in html content
- Serve a simple html page that rotates through screenshotted applications.

This should not be used as a final solution as there is little redundancy and maintence of the solution is large.

## How to Use

This project assumes a Windows 10 OS, NodeJS, Git is installed.

- Instll [Git](https://git-scm.com/downloads)
  - Make sure you pick Windows version

- Install [NodeJS](https://nodejs.org/en/)
  - LTS version is fine.

- Open an administrative command prompt.
  - Shift right click the cmd icon to open "Advanced Menu" options

- Clone the repository to a windows machine
  - `git clone https://github.com/Treee/ciscoboard-webpage-rotation`

- Navigate to the repo home directory
  - `cd ciscoboard-webpage-rotation`

- Run the install and start command
  - `npm install`
  - `npm start`

## Docker Commands (For Linux) pending

### Build

docker build -t flowmap-rotation .

### Run

docker run -d -p 8080:8080 flowmap-rotation
