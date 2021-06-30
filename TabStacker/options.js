
window.onload=()=>{
  function save_options() {
  let numofTabs = document.getElementById('numofTabs').value;
  chrome.storage.local.set({ 'tablimit':numofTabs}, ()=>{
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}
function currLimit(){
  chrome.storage.local.get('tablimit',(res)=>{
    return res.tablimit;
  });
}

document.getElementById('currLimit').textContent=""+currLimit()+"";

document.getElementById('save').addEventListener('click',save_options);
}