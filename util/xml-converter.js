const fs = require('fs');
const convert = require('xml-js');
const Logger = require('../log/Logger')(__filename);
const FileHelper = require('./file-helper');

function readLocalXMLFileAsJson(filename)
{
  return new Promise((resolve, reject) => 
  {
    try
    {
      FileHelper.readFile(filename).then(xml => 
      {
        try 
        {
          var options = {
            compact: true,
            ignoreComment: false,
            arrayNotation: true,
            spaces: 4
          };
                
          resolve(convert.xml2js(xml, options));
        }
        catch (xmlConvertError) 
        {
          console.log("error while converting xml file", xmlConvertError.message);
            
          try 
          {
            fs.unlinkSync(filename)
          } 
          catch(err) 
          {
            reject(
            {
              "fileName": filename,
              "status": "file deleted error out!!!!",
              "error": xmlConvertError.message
            });
          }
          reject(
          {
            "fileName": filename,
            "status": "file Deleted",
            "error": xmlConvertError.message
          });
        }
      }).catch(fileReaderError => 
      {
        Logger.debug('Inside readLocalXMLFileAsJson() inside fileReaderError catch block ...');
        let message = 'FILE READER ERROR : File reader was unable to read file [ ' + filename + ' ].  The error returned was -> ' + fileReaderError;
        Logger.error(message)
        reject(message);
      });
    }
    catch(error)
    {
      Logger.error('An exception occurred inside readLocalXMLFile() when trying to read file [ ' + filename + ' ].');
      Logger.error(error);
      reject(error);
    }
  });
}

module.exports.readLocalXMLFileAsJson = readLocalXMLFileAsJson;