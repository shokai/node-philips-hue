export function checkResponse(res){
  if(res instanceof Array){
    for(let i of res){
      if(i.error) throw new Error(JSON.stringify(i.error));
    }
  }
}
