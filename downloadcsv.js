const csvReader=require('./csvparsedata')
const takeMoneyExchangeData=require('./currencychangeapi')
const request=require('postman-request')
const fs=require('fs')
const validator = require('validator');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const downloadCsv=(filepath,base,callback)=>{
    csvReader(filepath,(result)=>{ 
        const keys=Object.keys(result[0])
        if((keys[1]!='Order Id')||(keys[2]!='Nonprofit')||(keys[3]!='Donation Currency')||(keys[4]!='Donation Amount')||(keys[5]!='Fee')){
        callback("please provide the sutaiable title",undefined)
        }
        
    
    
    console.log(result.length)
    takeMoneyExchangeData(base,(error,response)=>{
    if(error){
        callback(error,undefined)
        
    }
    
    for(let i=0;i<result.length;i++){
    const rupee=parseFloat(result[i]['Donation Amount'])
    const currencyType=result[i]['Donation Currency']
    result[i]['Donation Amount']=rupee*response[currencyType]
    }
    
    const map=new Map();
   
    for(let i=0;i<result.length;i++){
    
    if(isNaN(result[i]['Donation Amount'])){
        continue
    }
    
    if(map.has(result[i]['Nonprofit'])){
    
    let value=map.get(result[i]['Nonprofit'])
    value['Donation Amount']=value['Donation Amount']+result[i]['Donation Amount']
    value['Fee']=parseFloat(value['Fee'])+parseFloat(result[i]['Fee'])
    value['count']=value['count']+1
    map.set(result[i]['Nonprofit'],value)
    }
    else{
        const obj={
            'Donation Amount':'',
            'Fee':'',
            'count':0
        }
        obj['Donation Amount']=result[i]['Donation Amount']
        obj['Fee']=parseFloat(result[i]['Fee'])
        obj['count']=1
    
        map.set(result[i]['Nonprofit'],obj)
    }
    }
    
    const data=[]
    const csvfilename='./output/'+filepath.split('/')[1]
    console.log(csvfilename)
    const csvWriter = createCsvWriter({
      path: csvfilename,
      header: [
        {id: 'Nonprofit', title: 'NONPROFIT'},
        {id: 'Totalamount', title: 'TOTALAMOUNT'},
        {id: 'TotalFee', title: 'TOTALFEE'},
        {id: 'NumberofDonations', title: 'NUMBEROFDONATION'},
      ]
    });
    var get_entries = map.entries();
    for(var ele of get_entries){
    const resultObj={}
    resultObj.Nonprofit=ele[0]
    resultObj.Totalamount=ele[1]['Donation Amount']
    resultObj.TotalFee=ele[1]['Fee']
    resultObj.NumberofDonations=ele[1]['count']
    data.push(resultObj)
    }
    csvWriter
      .writeRecords(data)
      .then(()=> console.log('The CSV file was written successfully'));
   
      callback(undefined,csvfilename)
    }
    )
    }
    )
    }
    
  module.exports=downloadCsv  
    