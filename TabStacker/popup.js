window.onload=()=>{
    let tablist= document.getElementById("tablist");
    let storedlist;
    chrome.storage.local.get('stackofTabs',(res)=>{
        if(res){
            storedlist=res.stackofTabs;
            let err = chrome.runtime.lastError;
            if(err){
                console.log(err);
                tablist.innerText =err;
            }else{
                if(storedlist.length == 0){
                    tablist.innerText="No saved Tabs";
                }else{
                    for(let i=0;i<storedlist.length;i++){
                            let li=document.createElement("li");
                            li.setAttribute('value',i);
                            li.innerHTML="<img src="+storedlist[i].favIconUrl+"> <a href="+storedlist[i].url+">&nbsp;&nbsp;"+storedlist[i].title+"</a>";
                            tablist.appendChild(li);
                    } 
                }
                    
            }
        }     
    });
}