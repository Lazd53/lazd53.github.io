function addNode(item){
  let {element, classes, id, inner, child, children} = item;
  let newElement = document.createElement(item.element);
  if (typeof classes == "string" ){
    newElement.classList.add(item.classes);
  } else if (Array.isArray(classes)){
    for ( _class of classes){
      newElement.classList.add(_class);
    }
  }
  if (id) {newElement.id = id};
  if (inner){newElement.innerHTML = inner};
  if(child){newElement.appendChild(child)};
  if(children){
    for (child of children){
      newElement.appendChild(child);
    }
  }
  return newElement;
}
