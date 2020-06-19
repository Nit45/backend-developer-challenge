const csv = require('csv-parser')
const fs = require('fs')

const parse=(filename,callback)=>{
    const results = [];
    fs.createReadStream(filename)
    .pipe(csv({skip_lines_with_empty_values:true,skip_empty_lines:true,skip_lines_with_error:true}))
    .on('data', (data) => {
        results.push(data)
    })
    .on('end', () => {
        callback(results)
        }    
  );
}   
module.exports=parse