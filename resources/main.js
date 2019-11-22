
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
    viewMain.changeView(destination);
  },

  getElements(data, type){
    return(data[type].subCat);
  },

  getFragment(viewType){
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
    this.body = document.querySelector("body");
    this.nav = document.querySelector("nav");
  },

  clear(){
    if (this.main.firstChild){
      while(this.main.firstChild){
        this.main.removeChild(this.main.firstChild);
      }
    }
    this.body.removeAttribute("class");
  },

  changeView(view){
    this.clear();
    let fragment = controller.getFragment(view);
    if (view != "home"){
      this.nav.classList.remove("hide");
    } else if (view == "home"){
      this.nav.classList.add("hide");
    }
    this.main.appendChild(fragment.cloneNode("true"));

    this.body.classList.add(view);
  },

  createModal(content){
    let body = document.querySelector("body");
    let modalBackdrop = document.createElement("div");
    let modal = document.createElement("div");
    let close = document.createElement("button");
    let focusableToHide = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

    close.innerHTML = "X";
    close.classList.add("closeButton");
    close.id = "closeModal";
    close.addEventListener("click", this.deleteModal);
    modal.classList.add("modal");
    modal.classList.add("flex-center")
    modal.id = "modal";
    modal.appendChild(close);
    modal.appendChild(content);
    modalBackdrop.classList.add("modalBackdrop");
    this.body.appendChild(modalBackdrop);
    this.body.appendChild(modal);
    modalBackdrop.addEventListener("click", viewMain.deleteModal);
    this.trapFocus(modal, focusableToHide)
  },

  trapFocus(modal, toHide){
    let focusedElementBeforeModal = document.activeElement;
    let modalFocusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    for (element of toHide){
      element.tabIndex = -1;
    }
    modalFocusable[0].focus();
    modal.addEventListener('keydown', trapTabKey);

    function trapTabKey(){
      if (document.activeElement == modalFocusable[modalFocusable.length-1]){
        modalFocusable[0].focus();
        console.log(modalFocusable[0])
      }
    }
  },

  deleteModal(){
    let modal = document.querySelector("#modal");
    let modalBackdrop = document.querySelector(".modalBackdrop");
    let close = document.querySelector("#closeModal");
    close.removeEventListener("click", this.deleteModal);
    if (modal.firstChild){
      while(modal.firstChild){
        modal.removeChild(modal.firstChild);
      }
    }
    modal.remove();
    modalBackdrop.remove();

  }

}

let viewHome = {
  init(){
    this.body = document.querySelector("body");
    this.main = document.querySelector("main");
    this.home = document.querySelector("#homeGrid");
    this.body.addEventListener("click", function(event){viewHome.eventListenerControl(event.target)});
  },

  eventListenerControl(target){
    if (this.body.classList.contains("home")){
      this.eventListenerHome(target);
    } else if (this.body.classList.contains("projects")){
      this.eventListenerProjects(target);
    } else if (this.body.classList.contains("skills")){
      this.eventListenerSkills(target);
    } else if (this.body.classList.contains("education")){
      this.eventListenerEducation(target);
    }else if (this.body.classList.contains("experience")){
      this.eventListenerExperience(target);
    }
  },

  eventListenerHome(target){
    if (target.closest("#homeGrid")){
      event.preventDefault();
      if(event.target.closest("A")){
        let targetedLink = target.closest("A").id;
        controller.changeView(targetedLink);
      }
    }
  },

  eventListenerProjects(target){
    if (target.closest(".workContainer")){
      if (target.closest(".workCard")){
        event.preventDefault();
        let containerID = target.closest(".workContainer").id;
        let cardID = target.closest(".workCard").id;
        let projectModalContent = viewProjects.modalProjectContent(containerID, cardID);
        viewMain.createModal(projectModalContent);
      }
    }
  },

  eventListenerExperience(target){
    if (target.closest("section")){
      if (target.closest(".company")){
        event.preventDefault();
        let sectionID = target.closest("section").id;
        let companyID = target.closest(".company").id;
        let experienceModalContent = viewExperience.modalProjectContent(sectionID, companyID);
        viewMain.createModal(experiencetModalContent);
      }
    }
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
    let allWork = this.renderLibraryOfWork();
    return allWork;
  },

// retrieve info for this.modalProjectContent
  modalProjectInfo(subCatID, projectID){
    let projectSubCats = this.projects.subCat;
    for (key of Object.keys(projectSubCats)){
      let subCat = projectSubCats[key];
      if (subCat.subCatID == subCatID){
        let project = subCat.projects.find( x => x.projectID == projectID );
        return project;
      }
    }
  },

  modalProjectContent(subCatID, projectID){
    let project = this.modalProjectInfo(subCatID, projectID);
    let frag = document.createDocumentFragment();
    let title = document.createElement("h2");
    let projectImg = document.createElement("img");
    let textChunk = document.createElement("div");
    let projectDescription = document.createElement("p");
    let whatLearned = document.createElement("p")
    let linksContainer = document.createElement("div");
    let gitHubLink = document.createElement("a");
    let goToProject = document.createElement("a");

    let arr = [title, projectImg, textChunk, linksContainer];


    title.innerHTML = project.projectName;
    projectImg.src = project.projectImg;
    textChunk.classList.add("projectModalText")
    textChunk.appendChild(projectDescription);
    textChunk.appendChild(whatLearned);
    projectDescription.innerHTML = project.projectDescription;
    whatLearned.innerHTML = project.whatLearned;
    gitHubLink.href = project.gitHubUrl;
    gitHubLink.classList.add("modalProjectLinks");
    gitHubLink.innerHTML = "See this project on GitHub";
    goToProject.href = project.projectUrl;
    goToProject.innerHTML = `See ${project.projectName} here!`;
    goToProject.classList.add("modalProjectLinks");
    linksContainer.classList.add("modalProjectLinksContainer");

    linksContainer.appendChild(gitHubLink);
    linksContainer.appendChild(goToProject);

    arr.map( x => frag.appendChild(x));

    return frag;
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
    let container = document.createElement("DIV");

    title.innerHTML = category.name;
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
    card.id = project.projectID;
    let img = document.createElement("IMG");
    img.setAttribute("src", project.projectImg);
    let link = document.createElement("a")
    link.href = project.projectUrl;
    let name = document.createElement("H3");
    name.innerHTML = project.projectName;

    link.appendChild(name);
    card.appendChild(img);
    card.appendChild(link);

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

    let content = document.createElement("section");
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

  // retrieve info for this.modalProjectContent
    modalExperienceInfo(subCatID = 2.1, companyID = "2.1.1"){
      let experienceSubCats = this.experience.subCat;
      for (key of Object.keys(experienceSubCats)){
        console.log(key);
        let subCat = experienceSubCats[key];
        if (subCat.subCatID == subCatID){
          console.log(subCat);
          let company = subCat.companyList.find( x => x.id == companyID );
          return company;
        }
      }
    },

    modalExperienceContent(subCatID, projectID){
      let company = this.modalProjectInfo(subCatID, projectID);
      let frag = document.createDocumentFragment();
      let title = document.createElement("h2");
      let projectImg = document.createElement("img");
      let projectDescription = document.createElement("p");
      let whatLearned = document.createElement("p")
      let linksContainer = document.createElement("div");
      let gitHubLink = document.createElement("a");
      let goToProject = document.createElement("a");

      let arr = [title, projectImg, projectDescription, whatLearned, linksContainer];


      title.innerHTML = project.projectName;
      projectImg.src = project.projectImg;
      projectDescription.innerHTML = project.projectDescription;
      whatLearned.innerHTML = project.whatLearned;
      gitHubLink.href = project.gitHubUrl;
      gitHubLink.classList.add("modalProjectLinks");
      gitHubLink.innerHTML = "See this project on GitHub";
      goToProject.href = project.projectUrl;
      goToProject.innerHTML = `See ${project.projectName} here!`;
      goToProject.classList.add("modalProjectLinks");
      linksContainer.classList.add("modalProjectLinksContainer");

      linksContainer.appendChild(gitHubLink);
      linksContainer.appendChild(goToProject);

      arr.map( x => frag.appendChild(x));

      return frag;
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
