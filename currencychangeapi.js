const request=require('postman-request')
const takeMoneyExchangeData=(base,callback)=>{

    const url=`https://api.exchangeratesapi.io/latest?base=${base}`
    request(url,(err,res)=>{
        if(err){
            callback("unable to find data",undefined)
        }
        else{
             const data=JSON.parse(res.body)
             callback(undefined,data.rates)
        }
        
    }
    )
}
module.exports=takeMoneyExchangeData