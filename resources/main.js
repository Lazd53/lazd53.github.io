
let model = {
  data: null,
  currentView: "home",
  navBarElements: null,
  viewHome: null,
  viewProjects: null,
  viewSkills: null,
  viewExperience: null,
  viewEducation: null,
  viewAboutMe: null,
}

let controller = {
  init(){
    viewHome.init();
    model.viewHome = viewHome.saveHome();
    this.fetchAndProcessData();
    viewMain.init();

  },

  async fetchAndProcessData(){
    const fetchedData = await fetch("resources/data.json")
      .then(reply => reply.json())
    this.setModel(fetchedData);
  },

  setModel(data){
    model.data = data;
    model.navBarElements = this.setNavBarElements();
    // set projects, experience, skills, education, about me
    model.viewNav = viewNav.init(model.navBarElements);
    model.viewProjects = viewProjects.init();
    model.viewSkills = viewSkills.init();
    model.viewExperience = viewExperience.init();


  },

  setNavBarElements(){
    let data = model.data;
    let keys = Object.keys(data);
    let navEls = [];
    for (key of keys){
      let navInfo = data[key];
      navEls.push({
        name: navInfo.name,
        navID: navInfo.navID,
        link: navInfo.link
      })
    }
    return navEls;
  },

  createViews(nav, projects){
    viewNav.init(nav);
    viewMain.init();
  },

  changeView(destination){
    console.log(destination);
    viewMain.changeView(destination);
  },

  getElements(data, type){
    return(data[type].subCat);
  },

  getFragment(viewType){
    console.log(viewType);
    let capName = viewType.replace(viewType[0], viewType[0].toUpperCase());
    let modelName = `view${capName}`;
    return model[modelName];
  },

  getNavBarElements(){
    return model.navBarElements;
  },

  getFilteredData(type){
    return model.data[type];
  }
}

let viewNav = {
  init(nav){
    this.navBar = document.querySelector("#navBar");
    this.NavElements = nav;
    let navBar = this.createNavContainer();
    // this.createListener(this.navBar);
    this.activeNav(navBar);
    console.log(navBar);
    return navBar;
  },

  activeNav(navBarFrag){
    this.navBar.append(navBarFrag);
    this.createListener(this.navBar);
  },

  createListener(navBar){
    navBar.addEventListener("click", function(event){
      event.preventDefault();
      if (event.target.nodeName == "A"){
        controller.changeView(event.target.id);
      }
    })
  },

  createNavLink(name, id, classes, link){
    let aTag = document.createElement('a');
    if (classes){
      for (classInst of classes){
        aTag.classList.add(classInst)
      }
    }
    aTag.innerHTML = name;
    aTag.href = link;
    aTag.id = link;
    return aTag;
  },

  createNavContainer(){
    let docFrag = document.createDocumentFragment();
    for (NavEl of this.NavElements) {
      let link = this.createNavLink(NavEl.name, NavEl.navID, ["navLink"], NavEl.link);
      docFrag.appendChild(link);
    }
    return docFrag;
  }

}

let viewMain = {
  init(){
    this.main = document.querySelector("main");
    this.nav = document.querySelector("nav");
  },

  clear(){
    if (this.main.firstChild){
      while(this.main.firstChild){
        this.main.removeChild(this.main.firstChild);
      }
    }
    this.main.removeAttribute("class");
  },

  changeView(view){
    this.clear();
    let fragment = controller.getFragment(view);
    if (view != "home"){
      this.nav.remove("hide");
    } else if (view == "home"){
      this.nav.classList.add("hide");
    }
    this.main.appendChild(fragment);
    this.main.classList.add(view);
  }

}

let viewHome = {
  init(){
    this.main = document.querySelector("main");
    this.home = document.querySelector("#homeGrid");
    this.eventListener();
  },

  eventListener(){
    this.home.addEventListener("click", function(event){
      console.log("prevented!");
      event.preventDefault();
      if(event.target.closest("A")){
        let targetedLink = event.target.closest("A").id;
        controller.changeView(targetedLink);
      }
    })
  },
  saveHome(){
    let docFrag = document.createDocumentFragment();
    let duplicate = this.main.cloneNode(true).children;
    let duplicateArr = [...duplicate];
    duplicateArr.map(child => docFrag.appendChild(child));
    return docFrag;
  }
}

let viewProjects = {
  init(){
    this.projects = controller.getFilteredData("projects");
    return this.renderLibraryOfWork();
  },

  createMainFocal(){
    let section = document.createElement("SECTION");
    section.classList.add("mainFocal");
    let featuredImg = document.createElement("IMG");
    featuredImg.setAttribute("src","images/lanterns.jpg");
    featuredImg.setAttribute("alt", "Temporary photo of Japanese Lanterns!")
    section.appendChild(featuredImg);
    this.main.prepend(section);
  },

  renderLibraryOfWork(){
    let section = document.createElement("SECTION");
    section.classList.add("featuredWork");
    section.id = "featuredWork";
    let title = document.createElement("H2");
    title.innerHTML = "Featured Work";
    section.appendChild(title);
    section.appendChild(this.renderAllProjectCategories());
    return section;
  },

  renderAllProjectCategories(){
    let workContainer = document.createElement("DIV");
    for (category of Object.values(this.projects.subCat)){
      workContainer.appendChild(this.createCategory(category));
    }
    return workContainer;
  },

  createCategory(category){
    let div = document.createElement('div');
    let title = document.createElement("H4");
    title.innerHTML = category.name;
    let container = document.createElement("DIV");
    container.classList.add("workContainer");
    container.id = category.subCatID;
    for (project of category.projects){
      let card = this.createProjectCard(project);
      container.appendChild(card);
    }
    div.appendChild(title);
    div.appendChild(container);
    return div;
  },

  createProjectCard(project){
    let card = document.createElement("div");
    card.classList.add("workCard");
    let img = document.createElement("IMG");
    img.setAttribute("src", project.projectImg);
    let name = document.createElement("H2");
    name.innerHTML = project.projectName;
    let link = document.createElement("A");
    link.innerHTML = project.gitHubUrl;

    card.appendChild(img);
    card.appendChild(name);

    return card;
  }




}

let viewSkills = {
  init(){
    this.skillTypes = controller.getFilteredData("skills");
    let title = document.createElement("H2");
    title.innerHTML = this.skillTypes.name;

    let allSkills = document.createElement("div");
    allSkills.appendChild(this.createSkillsContent(this.skillTypes.subCat));

    let content = document.createDocumentFragment();
    content.appendChild(title);
    content.appendChild(allSkills);
    return content;


  },

  createSkillsContent(allSkills){
    let keys = Object.keys(allSkills);
    let docFrag = document.createDocumentFragment();
    for (key of keys){
      docFrag.appendChild(this.createSection(allSkills[key]));
    }
    return docFrag;
  },

  createSection(subCategory){
    let section = document.createElement('section');
    section.classList.add("skillSection");
    let title = document.createElement("h3");
    title.innerHTML = `\< ${subCategory.name} \>`;
    section.appendChild(title);
    let list = document.createElement("ul");
    for (listItem of subCategory.skillList){
      let newItem = this.createFirstList(listItem);
      list.appendChild(newItem);
    }
    section.appendChild(list);
    return section;
  },

  createFirstList(listItem){
    let li = document.createElement("li");
    li.innerHTML = `.${listItem[0]}`;
    if (listItem[1]){
      let subList = document.createElement("ul");
      for (subItem of listItem[1]){
        let newSubItem = this.createSecondList(subItem);
        subList.appendChild(newSubItem);
      }
      li.appendChild(subList)
    }
    return li;
  },
  createSecondList(subItem){
    let li = document.createElement("li");
    li.innerHTML = `#${subItem}`;
    return li;
  }


}

let viewExperience = {
  init(){

    this.experience = controller.getFilteredData("experience");

    let title = document.createElement("H2");
    title.innerHTML = this.experience.name;

    let allExp = this.createExperienceContent(this.experience.subCat);

    let content = document.createDocumentFragment();
    content.appendChild(title);
    content.appendChild(allExp);
    return content;
  },

  createExperienceContent(subCat){
    let content = document.createDocumentFragment();
    let keys = Object.keys(subCat);
    for (key of keys){
      let employmentCategory = this.createExpCategories(subCat[key]);
      content.appendChild(employmentCategory);
    }
    return content;
  },

  createExpCategories(expCat){
    let section = document.createElement("section");

    let catTitle = document.createElement("h3");
    catTitle.innerHTML = expCat.type;
    section.appendChild(catTitle);

    for (company of expCat.companyList){
      let newCompany = this.createCompanyInfo(company);
      section.appendChild(newCompany);
    }

    return section;
  },

  createCompanyInfo(company){
    let companyContainer = document.createElement("div");
    companyContainer.classList.add("company");
    let companyName = document.createElement("h4");
    companyName.innerHTML = company.name;
    companyContainer.appendChild(companyName);
    let companyInfo = document.createElement("ul");
    let infoKeys = ["role", "business", "project", "dates"];
    for (key of infoKeys){
      let li = document.createElement('li');
      li.innerHTML = company[key];
      companyInfo.appendChild(li);
    }
    companyContainer.appendChild(companyInfo);
    return companyContainer;
  }
}


controller.init();
