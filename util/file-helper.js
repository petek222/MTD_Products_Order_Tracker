const glob = require('glob');
const fs = require('fs');
const convert = require('xml-js');

const Logger = require('../log/Logger')(__filename);

function listLocalXMLFilesRecursive(localDirectory)
{
  return new Promise((resolve, reject) =>
  {
    // now let's read all of the xml files that were downloaded ... this ignores .gitignore
    Logger.debug('Inside listLocalXMLFilesRecursive()');

    listLocalFiles(localDirectory, '/**/*.xml').then(files =>
    {
      resolve(files);
    }).catch(err =>
    {
      Logger.error('An error occurred when attempting to recursively list XML files in the [ \'' + localDirectory + '\' ] directory.');
      reject(err);
    });
  });
}

/* This is the non-recursive version*/
function listLocalXMLFiles(localDirectory)
{
  return new Promise((resolve, reject) =>
  {
    // now let's read all of the xml files that were downloaded ... this ignores .gitignore
    Logger.debug('Inside listLocalXMLFiles()');

    listLocalFiles(localDirectory, '/*.xml').then(files =>
    {      
      resolve(files);
    }).catch(err =>
    {
      Logger.error('An error occurred when attempting to list XML files in the [ \'' + localDirectory + '\' ] directory.');
      reject(err);
    });
  });
}

function listLocalFiles(localDirectory, filePattern)
{
  Logger.debug('Inside listLocalFiles()');
  return new Promise((resolve, reject) => 
  {
    try
    {      
      glob(localDirectory + filePattern, {}, (err, filenames)=>
      {
        if (err) 
        {
          Logger.error(err);
          reject(err);
        }
      
        Logger.debug('[ ' + filenames.length + ' ] files were found in local directory [ ' + localDirectory + ' ] ...');            
        Logger.debug(filenames);
        Logger.debug('Is this an array ? ' + Array.isArray(filenames));
            
        resolve(filenames);
      });
    }
    catch(err)
    {
      Logger.error('An error occurred when attempting to list files in the [ ' + localDirectory + ' ] directory.');
      reject(err);
    }
    Logger.debug('Leaving listLocalFiles()');
  });  
}

function readFile(filename)
{
  return new Promise((resolve, reject) => 
  {
    try
    {
      fs.readFile(filename, 'utf8', function (err, theFile) 
      {
        Logger.debug('processing file : ' + filename);
            
        if (err)
        {
          Logger.debug('inside the err block');
          Logger.error("FileHelper.readFile() error : " + err.message);
          reject(err);
        } 
        else 
        {     
          if (theFile)
          {
            resolve(theFile);
          }
          else
          {
            reject('No file was found for filename [ ' + filename + ' ].');
          }
        }
      });
    }
    catch(err)
    {
      Logger.debug('inside second catch block');
      reject(err);
    }
  });
}

function readFileAsJson(filename)
{
  return new Promise((resolve, reject) => 
  {
    var options = {
        compact: true,
        ignoreComment: false,
        arrayNotation: true,
        spaces: 4
      };

      try
      {
        Logger.debug('readFileAsJson() before readFile()');
        readFile(filename).then(theFile =>
        {
          Logger.debug('Read the file ... attempting to convert it...');
          
          if (theFile)
          {
            try
            {
              resolve(convert.xml2js(theFile, options));
            }
            catch(error)
            {
              let message = 'An error occurred when attempting to convert file [ ' + theFile + ' ] to JSON.' + error;
              Logger.error(message);
              reject(message);
            }            
          }
          else
          {
            reject('The file [ ' + filename + ' ] was not able to be read.  ' + error);
          }
        }).catch(err=>
        {
          Logger.error('An error occurred when attempting to convert the xml file [ ' + filename + ' ] to json.');
          reject(err);
        });
      }
      catch(err2)
      {
        Logger.error('An error occurred when attempting to read in file [ ' + filename + ' ].');
        Logger.error(err2);
        reject(err2);
      }
  });
}

function deleteLocalFile(filename)
{  
  return new Promise((resolve, reject) => 
  {
    try 
    {
      Logger.debug('Attempting to delete local file [ ' + filename + '].');
      fs.unlinkSync(filename);
      Logger.debug('After delete call ...');
      resolve('Local file [ ' + filename + ' ] has been successfully deleted from the file system.');
    } 
    catch(err) 
    {
      reject(
        {
          "fileName": filename,
          "status": "file delete error out!!!!",
          "error": err.message
        });
    }
  });
}

module.exports.listLocalFiles=listLocalFiles
module.exports.listLocalXMLFiles=listLocalXMLFiles;
module.exports.listLocalXMLFilesRecursive=listLocalXMLFilesRecursive;

module.exports.readFile=readFile
module.exports.readFileAsJson=readFileAsJson

module.exports.deleteLocalFile=deleteLocalFile