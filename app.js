function addScript(src) {
var newScript = document.createElement("script");
newScript.src = src;
document.head.appendChild(newScript);
}

function initFirebase(){
	addScript("https://www.gstatic.com/firebasejs/5.5.4/firebase.js");

	setTimeout(configFirebase,1000);
}

var obj;

var containingDiv = document.getElementById("containingDiv");

function configFirebase(){
	let config = {
	    databaseURL: "https://pong-demo-csc.firebaseio.com"
	};
	firebase.initializeApp(config);

	firebase.database().ref().on("value",function(snap){
		obj = snap.val();
		output.innerText = JSON.stringify(obj);
		objChanged(obj);
	});

}

function showData(){
	firebase.database().ref().once("value",function(snap){
		console.log(snap.val());
	});
}

initFirebase();

var output = document.createElement("p");

document.body.appendChild(output);

var parsedData;

function clearDiv(){
	containingDiv.innerHTML="";
}

function scan(funcData, path, div){
	for(prop in funcData){
		var count = path.length;
		var tempObj = document.createElement("div");
		tempObj.style.whiteSpace = "nowrap";
		tempObj.innerText = prop;
		tempObj.innerHTML="<strong>"+tempObj.innerText+"<span onclick='editObj(this)'>&#x270E;</span><span onclick='deleteObj(this)'>&#x2716;</span></strong>";
		tempObj.style.borderRadius = "5px";
		tempObj.style.margin="5px";
		//tempObj.style.minWidth="5vw";
		tempObj.style.display = "inline-block";
		var shadeOfBlack = 255 - (count+1)*10%256;
		tempObj.style.backgroundColor = "rgb("+shadeOfBlack+", "+shadeOfBlack+", "+shadeOfBlack+")";
		if(shadeOfBlack<100){
			tempObj.style.color = "white";
		}else{
			tempObj.style.color = "black";
		}
		if(count!=0){
			tempObj.style.marginLeft="5vw"
		}
		//tempObj.style.marginRight="0px"

		var temparr = path.slice(0);
		temparr.push(prop);

		for(var i =0; i!=temparr.length; i++){
			tempObj.dataset["path-"+i] = temparr[i];
		}

		if(funcData[prop] !== null && typeof funcData[prop] === 'object'){
			scan(funcData[prop],temparr,tempObj);
		}else{
			var val
			if(typeof funcData[prop] === 'string')
				val = "\""+funcData[prop].replace(/</g,"&lt;")+"\"";
			else
				val = funcData[prop];
			tempObj.innerHTML+=": "+ val;
		}
		//tempObj.style.wordWrap = "break-word";
		div.appendChild(document.createElement("br"));
		div.appendChild(tempObj);
	}
}

var tab = document.createElement("pre")
tab.innerHTML = "&#09;";
tab.style.display = "inline";

function textScan(funcData,div,count){
	if(funcData[prop] !== null && typeof funcData[prop] === 'object'){
		div.innerText+="{"
	}
	count++;
	console.log(count);
	for(prop in funcData){
		var tempObj = document.createElement("div");
		tempObj.style.display = "inline";

		tempObj.innerText = "'"+prop+"'";
		if(typeof funcData[prop] !== 'object'){
			var val;
			if(typeof funcData[prop] === 'string')
				val = "\""+funcData[prop].replace(/</g,"&lt;")+"\"";
			else
				val = funcData[prop];
			tempObj.innerText+=": "+ val;
		}else{
			tempObj.innerText+=": {"
		}

		div.appendChild(document.createElement("br"));

		for(var i = 0;i!=count;i++){
			div.appendChild(tab.cloneNode(true));
		}

		div.appendChild(tempObj);

		if(funcData[prop] !== null && typeof funcData[prop] === 'object'){
			console.log(count);
			textScan(funcData[prop],div,count);

			div.appendChild(document.createElement("br"));
			for(var i = 0;i!=count;i++){
				div.appendChild(tab.cloneNode(true));
			}
			var bracket = document.createElement("div");
			bracket.innerText = "}";
			bracket.style.display = "inline";
			div.appendChild(bracket.cloneNode(true));
		}
	}
	if(funcData[prop] !== null && typeof funcData[prop] === 'object'){
		div.innerText+="}"
	}
}

function editObj(elem){
	var parentElem = elem.parentNode.parentNode;
	console.log(elem);
	console.log(parentElem.firstChild.firstChild);
	var parentName = parentElem.firstChild.firstChild.textContent;
	console.log(parentElem.firstChild.firstChild.textContent);
  while (parentElem.lastChild) {
    parentElem.removeChild(parentElem.lastChild);
	}
	eval("var subObj = obj"+parentElem.dataset.path.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")+";");
	console.log(parentName);
	var editText = document.createElement("div");
	editText.contentEditable = true;
	//editText.innerHTML += <pre>&#09;</pre>
	console.log({[parentName]:{subObj}});
	textScan({[parentName]:{subObj}},editText,0);
	parentElem.appendChild(editText);
	//parentElem.innerHTML = "";
	//var divs = elem.parentNode.parentNode.childNodes.getElementsByTagName("div");
	//for(var index = divs.length-1; index!=-1; index--){
			//console.log(divs[index]);
			//parentElem.removeChild(divs[index]);
			//console.log(parentElem);
	//}
	//eval("obj"+elem.parentNode.parentNode.dataset.path+"='YEET'");
	//objChanged(obj);
}
function deleteObj(elem){
	console.log(elem.parentNode.parentNode);
	var i = 0;
	tempObj = obj;
	var props = [];
	while(elem.parentNode.parentNode.hasAttribute("data-path-"+i)){
		props.push(elem.parentNode.parentNode.dataset["path-"+i]);
		i++;
	}
	console.log(props);
	deletePropertyPath(obj,props);
	objChanged(obj);
}

//HOW??????????
//HOW??????????
function deletePropertyPath (newobj, path) {
	console.log(newobj);
	console.log(path);
  for (var i = 0; i < path.length - 1; i++) {
			console.log(path[i]+"test");
    newobj = newobj[path[i]];

  }
  delete newobj[path.pop()];
};
//HOW??????????
//HOW??????????

function objChanged(NewObj){
	clearDiv();
	scan(NewObj,[],containingDiv);
}
