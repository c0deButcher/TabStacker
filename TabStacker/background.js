"use strict";
var stackofTabs=[];
var allowedTabs=10;
function storageInit(){ //
  chrome.storage.local.get({stackofTabs:[],tablimit:10}, (data)=>{
    chrome.storage.local.set(data);
    allowedTabs=data.tablimit;
    stackofTabs=data.stackofTabs;
  });
}
function TabPropertyAssigner(tab){
  const Tabprop={ url:tab.url, favIconUrl:tab.favIconUrl,title:tab.title
  }
  return Tabprop;
}
storageInit();
chrome.tabs.onCreated.addListener(()=>{
  console.log("tab created");
  let OpenedTabsList;
  chrome.tabs.query({currentWindow:true,active:false,pinned:false},(result) => {
    //console.log(result);
    if(result.length > allowedTabs){
      //console.log("tabs are greater than allowed tabs");
      OpenedTabsList=result;
      let TabtoRemove=TabPropertyAssigner(OpenedTabsList[0]); //first tab to remove [oldest] from browser window

      let TabtoRemoveId=OpenedTabsList[0].id;
      chrome.tabs.remove(TabtoRemoveId,()=>{ // closing tab 
        console.log("one tab removed");//add errror check
        chrome.storage.local.get('stackofTabs',(tablist)=>{ // saving tab details {accessing the stack}
          let UpdatedStackofTabs=tablist.stackofTabs;
          if(TabtoRemove.url != "chrome://newtab/"){
            UpdatedStackofTabs.push(TabtoRemove);
          }
          
          //chrome.storage.local.remove('stackofTabs',()=>{
            chrome.storage.local.set({'stackofTabs':UpdatedStackofTabs},()=>{ //saving tab details {updating the stack}
              let error = chrome.runtime.lastError;
              if (error) {
                console.error(error);
              }else{
                console.log("printing storage");
                chrome.storage.local.get((result)=>{console.log(result);}); //printing storage
              }
            });
          //});
          
          });
      });
    }//if end
  });
});
chrome.tabs.onRemoved.addListener(()=>{
  console.log("tab removed ");
  chrome.storage.local.get('stackofTabs',(tablist)=>{ // getting stack of tabs
    if(tablist.stackofTabs.length > 0 ){
      chrome.tabs.query({currentWindow:true},(result) => { //getting number of open tabs
        if(result.length <= allowedTabs && result.length > 0){
          let UpdatedStackofTabs=tablist.stackofTabs;
          //console.log(stackofTabs);
          let tabToRestoreUrl=UpdatedStackofTabs[UpdatedStackofTabs.length-1].url;
          console.log("restoring "+tabToRestoreUrl);
          chrome.tabs.create({url:tabToRestoreUrl,active:false,index:0},(newtab)=>{ // creating last closed tab //[restoring]
            if(newtab){
              UpdatedStackofTabs.pop();
              //chrome.storage.remove('stackofTabs',()=>{ 
                chrome.storage.local.set({'stackofTabs':UpdatedStackofTabs},()=>{ // updating stack [deleting the tab details]
                  let err=chrome.runtime.lastError;
                  if(err){
                    console.log(err);
                  }else{
                    console.log("tab created and storage updated");
                  }
                  
                });
              //});
            }
          });
        }  
      });
    }
  });
  
  
});



    

  

 
