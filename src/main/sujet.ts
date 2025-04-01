import { BrowserWindow, ipcMain, IpcMain } from "electron";
import path from "path";

export default async function RequestHtmlSujet(
  base_url: string
): Promise<string> {
  return new Promise<string>((resolve) => {
    // new browser window

    return resolve(`<html lang="fr"><head>
                <title>1-Boucle PBL</title>
                <meta charset="UTF-8">
                <meta name="generator" content="SCENARI 6.3.11 / OpaleCesiExtProblem 24.1.0">
                <meta name="revision" content="2025-03-17 10:46">
                <link rel="start" href="_1_-_Prosit_Systeme_d_information.html" title="1-Boucle PBL">
                <meta name="author" content="">
                <meta name="keywords" content="">
                <meta name="date" content="">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" type="text/css" href="../lib-md/w_scCodeMgr/scCodeMgr.css">
                <link rel="stylesheet" type="text/css" href="../lib-md/w_tePlayer/tePlayer.css">
                <script>
/*0*/ var scServices = {id:"m8cxw8ty"};
/*1*/ window.scLoadParams = {destUri:"/co/_1_-_Prosit_Systeme_d_information.html", pathToRoot:"../"};
</script>
                <script src="../lib-sc/scCoLib.js"></script>
                <script src="../lib-sc/scSiLib.js"></script>
                <script src="../lib-sc/scTiLib.js"></script>
                <script src="../lib-sc/scPaLib.js"></script>
                <script src="../lib-sc/scMapMgr.js"></script>
                <script src="../lib-sc/scTooltipMgr.js"></script>
                <script src="../lib-sc/scDynUiMgr.js"></script>
                <script src="../lib-md/s_assmnt.js"></script>
                <script src="../lib-sc/scDragMgr.js"></script>
                <script src="../lib-sc/scAssmntMgr.js"></script>
                <script src="../lib-md/w_teMgr/teLoader.js"></script>
                <script src="../lib-md/w_tplMgr/tplMgr.js"></script>
                <script src="../lib-md/w_mathjax/mathjaxMgr.js"></script>
                <script src="../lib-md/s_scSearch/jsSearch.js"></script>
                <script type="module" defer="" crossorigin="anonymous" src="../lib-md/w_appMgr/appMgr.js"></script>
                <script src="../lib-md/w_tePlayer/tePlayer.js"></script>
                <script src="../lib-md/w_scCodeMgr/scCodeMgr.js"></script>
                <script src="../lib-md/w_scImageMgr/scImageMgr.js"></script>
                <script>
/*0*/ try{if(window.opener && window.opener.scServices && window.opener.scServices.id == scServices.id) scServices = window.opener.scServices; else if(window.parent && window.parent.scServices && window.parent.scServices.id == scServices.id) scServices = window.parent.scServices;}catch(e){}
scCodeMgr.registerCode("des:div.code");

scImageMgr.registerAdaptedImage("ide:content/des:figure.resInFlow/des:img");

scImageMgr.registerGallery("des:div.galFra");

scImageMgr.registerSequence("des:div.seqFra");

scImageMgr.registerSvg("des:svg");
scImageMgr.registerZoom("des:a.svgZoom",{type:"svg",svgMax:1,toolbar:1,titlePath:"par:/nsi:/des:span.capTi"});

scImageMgr.registerZoom("des:a.imgZoom",{toolbar:1,mag:1,titlePath:"par:/nsi:/des:span.capTi"});

tePlayerMgr.init();
</script>
                <link rel="shortcut icon" type="image/png" href="../skin/img/favicon.png">
                <meta name="robots" content="index,follow">
                <link type="text/css" rel="stylesheet" href="../skin/css/main.css" media="all">
                <link type="text/css" rel="stylesheet" href="../skin/css/skin.css" media="all">
                <style type="text/css">
  html{overflow: auto;position: static;}
</style>
        </head>
        <body class="app is-phase loaded nav_stuck_yes">
                <header id="header" role="banner">
                        <div id="title"><h1><span>1-Boucle PBL</span></h1></div>
                        <nav aria-label="menu de navigation principal" class="menu" id="outCat" role="navigation"></nav>
                        <ul id="accessibility">
                                <li class="waiContent"><a href="#content"><span>contenu</span></a></li>
                        </ul>
                </header>
                <main id="main" role="main">
                        <div class="case"><div id="tools"><a class="cbkOpenBtn" href="#" title="Afficher toutes les sections qui sont referm├®es" role="button"><span>Tout afficher</span></a><a class="cbkCloseBtn" href="#" title="R├®duire toutes les sections qui sont ouvertes" role="button"><span>Tout r├®duire</span></a></div><nav class="menu" id="outSec"><ul><li><a href="#aN6" class="part_ti_lo " title="Sujet"><span><span>Sujet</span></span></a></li></ul></nav><div id="content"><section class="part topic"><h2 id="aN6" class="part_ti"><span>Sujet</span></h2><div class="part_co "><article class="collapsed subject"><a role="button" style="display:block;" href="#" class="collapsed_open" onkeydown="scDynUiMgr.handleBtnKeyDwn(event);" onkeyup="scDynUiMgr.handleBtnKeyUp(event);" onclick="scDynUiMgr.collBlkToggle(this, scPaLib.findNode('par:/chl:div.collapsed_co',this),'collapsed_open','collapsed_closed');return false;"><span class="collapsed_ti "><span class="collapsed_tiIn ">├ënonc├®</span></span></a><div class="collapsed_co  collBlk_open"><section class="hBk article practUc"><h3 id="aN12" class="hBk_ti"><span>Exercice&nbsp;: Syst├¿me d'information</span></h3><div class="hBk_co "><div class="hBk desc"><div class="hBk_co "><div class="rBk "><p>Mon projet vise ├á accompagner la startup COP (centre dÔÇÖorientation professionnelle) en mettant ├á leur disposition des locaux gracieusement pr├¬t├®s par une entreprise h├┤te. La startup dispose de moyens financiers tr├¿s limit├®s.</p><p>L'entreprise h├┤te leur permet, gracieusement, de b├®n├®ficier de la connexion internet de l'entreprise. Toutefois, l'entreprise ne veut pas mettre ├á disposition ses serveurs. En effet, leur nombre de serveurs est limit├®. De plus, ils h├®bergent toute la comptabilit├® de l'entreprise via leur ERP et les donn├®es structur├®es sous SQL SERVER. Ils ne peuvent donc pas prendre le risque de tout partager avec la startup. Elle devra alors ├¬tre autonome, m├¬me si elle peut s'appuyer partiellement sur l'infrastructure h├┤te. Finalement, malgr├® des moyens financiers limit├®s, COP a pu acqu├®rir du mat├®riel informatique.</p><p>J'ai propos├® ├á la startup de concevoir et d├®ployer un site web pour lÔÇÖorientation professionnelle, qui sera h├®berg├® localement dans un environnement serveur adapt├®. La startup m'a confi├® l'ensemble du mat├®riel pour que je puisse, une fois la conception et la r├®alisation faites, d├®ployer et param├®trer l'ensemble du mat├®riel. En th├®orie, la route de la r├®ussite semble toute trac├®e. Toutefois, mon intuition me dit qu'il y a quand m├¬me quelques difficult├®s ├á venir. Je ne sais pas quels dispositifs doivent ├¬tre mis en place pour que les salari├®s de la startup puissent travailler. Pour terminer sur l'aspect financier, une premi├¿re concertation rapide me laisse penser que nous pouvons nous ├®quiper de quelques postes clients suppl├®mentaires, de 3 ou 4 serveurs de petite taille, d'un syst├¿me de commutation, de t├®l├®phonie IP, d'une borne wifi pour les smartphones et autres m├®dias sans fil, d'une imprimante et d'├®quipements permettant de g├®rer les flux entrants de communication informatique. L'entreprise h├┤te va, gracieusement, me d├®l├®guer du personnel : un administrateur syst├¿me et r├®seau, et un architecte SI, qui vont mÔÇÖaider ├á concevoir et ├á mod├®liser la maquette fonctionnelle et la maquette technique du SI, avant que je ne le mette en oeuvre. Avant de me lancer dans ce projet, j'aimerais avoir une vision claire de ce quÔÇÖil faut faire; je d├®cide donc d'utiliser des outils tels que WBS/OBS.</p><p>Pour lancer son activit├®, la startup a besoin de faire une ├®tude statistique des r├®sultats Parcoursup des derni├¿res ann├®es. Mais pour cela, elle doit dÔÇÖabord alimenter sa base de donn├®es. Il faudra donc trouver des donn├®es fiables. Je pourrai aller les chercher sur data.gouv ÔÇª Peut-├¬tre existe-t-il des donn├®es ouvertes, et gratuites, ├á exploiterÔÇª Mais il faudra trouver et exploiter un jeu de donn├®es de qualit├® tout en respectant les normes internationales.</p></div></div></div></div></section></div></article><article class="collapsed res"><a role="button" style="display:block;" href="#" class="collapsed_open" onkeydown="scDynUiMgr.handleBtnKeyDwn(event);" onkeyup="scDynUiMgr.handleBtnKeyUp(event);" onclick="scDynUiMgr.collBlkToggle(this, scPaLib.findNode('par:/chl:div.collapsed_co',this),'collapsed_open','collapsed_closed');return false;"><span class="collapsed_ti "><span class="collapsed_tiIn ">Ressources pour les ├®tudiants</span></span></a><div class="collapsed_co  collBlk_open"><ul class="txt_il "><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://openclassrooms.com/fr/courses/2100086-decouvrez-le-monde-des-systemes-dinformation#table-of-content" rel="noopener" title="https://openclassrooms.com/fr/courses/2100086-decouvrez-le-monde-des-systemes-dinformation#table-of-content (nouvelle fen├¬tre)"><span>https://openclassrooms.com/fr/courses/2100086-decouvrez-le-monde-des-systemes-dinformation#table-of-content</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/R%C3%A9seau_informatique" rel="noopener" title="https://fr.wikipedia.org/wiki/R├®seau_informatique (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/R├®seau_informatique</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Serveur_informatique" rel="noopener" title="https://fr.wikipedia.org/wiki/Serveur_informatique (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Serveur_informatique</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.cegid.com/fr/faq/quest-quun-erp/" rel="noopener" title="https://www.cegid.com/fr/faq/quest-quun-erp/ (nouvelle fen├¬tre)"><span>https://www.cegid.com/fr/faq/quest-quun-erp/</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Active_Directory" rel="noopener" title="https://fr.wikipedia.org/wiki/Active_Directory (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Active_Directory</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/RJ45" rel="noopener" title="https://fr.wikipedia.org/wiki/RJ45 (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/RJ45</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.journaldunet.fr/web-tech/dictionnaire-du-webmastering/1203321-switch-definition-traduction-et-acteurs/" rel="noopener" title="https://www.journaldunet.fr/web-tech/dictionnaire-du-webmastering/1203321-switch-definition-traduction-et-acteurs/ (nouvelle fen├¬tre)"><span>https://www.journaldunet.fr/web-tech/dictionnaire-du-webmastering/1203321-switch-definition-traduction-et-acteurs/</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.futura-sciences.com/tech/definitions/internet-routeur-1306/" rel="noopener" title="https://www.futura-sciences.com/tech/definitions/internet-routeur-1306/ (nouvelle fen├¬tre)"><span>https://www.futura-sciences.com/tech/definitions/internet-routeur-1306/</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Site_web" rel="noopener" title="https://fr.wikipedia.org/wiki/Site_web (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Site_web</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Adresse_IP" rel="noopener" title="https://fr.wikipedia.org/wiki/Adresse_IP (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Adresse_IP</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.it-connect.fr/les-adresses-ip-privees-et-publiques/" rel="noopener" title="https://www.it-connect.fr/les-adresses-ip-privees-et-publiques/ (nouvelle fen├¬tre)"><span>https://www.it-connect.fr/les-adresses-ip-privees-et-publiques/</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/R%C3%A9seau_local_virtuel#:~:text=Les%20VLAN%20permettent%20%3A,isol%C3%A9%20pour%20am%C3%A9liorer%20la%20s%C3%A9curit%C3%A9" rel="noopener" title="https://fr.wikipedia.org/wiki/R├®seau_local_virtuel (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/R├®seau_local_virtuel</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://univ.scholarvox.com/reader/docid/88950929/page/661?searchterm=Pujolle,%20Guy" rel="noopener" title="https://univ.scholarvox.com/reader/docid/88950929/page/661?searchterm=Pujolle,%20Guy (nouvelle fen├¬tre)"><span>https://univ.scholarvox.com/reader/docid/88950929/page/661?searchterm=Pujolle,%20Guy</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://univ.scholarvox.com/reader/docid/88950929/page/782?searchterm=Pujolle,%20Guy" rel="noopener" title="https://univ.scholarvox.com/reader/docid/88950929/page/782?searchterm=Pujolle,%20Guy (nouvelle fen├¬tre)"><span>https://univ.scholarvox.com/reader/docid/88950929/page/782?searchterm=Pujolle,%20Guy</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://lesdefinitions.fr/securite-informatique" rel="noopener" title="https://lesdefinitions.fr/securite-informatique (nouvelle fen├¬tre)"><span>https://lesdefinitions.fr/securite-informatique</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Administrateur_syst%C3%A8me" rel="noopener" title="https://fr.wikipedia.org/wiki/Administrateur_syst├¿me (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Administrateur_syst├¿me</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Administrateur_r%C3%A9seau" rel="noopener" title="https://fr.wikipedia.org/wiki/Administrateur_r├®seau (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Administrateur_r├®seau</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Administrateur_de_base_de_donn%C3%A9es" rel="noopener" title="https://fr.wikipedia.org/wiki/Administrateur_de_base_de_donn├®es (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Administrateur_de_base_de_donn├®es</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.letudiant.fr/metiers/secteur/informatique-telecom-web/architecte-en-systeme-d-information.html" rel="noopener" title="https://www.letudiant.fr/metiers/secteur/informatique-telecom-web/architecte-en-systeme-d-information.html (nouvelle fen├¬tre)"><span>https://www.letudiant.fr/metiers/secteur/informatique-telecom-web/architecte-en-systeme-d-information.html</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Internet_Protocol" rel="noopener" title="https://fr.wikipedia.org/wiki/Internet_Protocol (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Internet_Protocol</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://ics.utc.fr/portail_linios/Linios/LINIO_gpfoad/co/intro.html" rel="noopener" title="https://ics.utc.fr/portail_linios/Linios/LINIO_gpfoad/co/intro.html (nouvelle fen├¬tre)"><span>https://ics.utc.fr/portail_linios/Linios/LINIO_gpfoad/co/intro.html</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.workbreakdownstructure.com/fr/" rel="noopener" title="https://www.workbreakdownstructure.com/fr/ (nouvelle fen├¬tre)"><span>https://www.workbreakdownstructure.com/fr/</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.cedip.developpement-durable.gouv.fr/IMG/pdf/fondamentaux-gestion-projet.pdf" rel="noopener" title="https://www.cedip.developpement-durable.gouv.fr/IMG/pdf/fondamentaux-gestion-projet.pdf (nouvelle fen├¬tre)"><span>https://www.cedip.developpement-durable.gouv.fr/IMG/pdf/fondamentaux-gestion-projet.pdf</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.tbs-sct.gc.ca/emf-cag/project-projet/documentation-documentation/guide-guide/guide-guide-fra.pdf" rel="noopener" title="https://www.tbs-sct.gc.ca/emf-cag/project-projet/documentation-documentation/guide-guide/guide-guide-fra.pdf (nouvelle fen├¬tre)"><span>https://www.tbs-sct.gc.ca/emf-cag/project-projet/documentation-documentation/guide-guide/guide-guide-fra.pdf</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.lebigdata.fr/base-de-donnees" rel="noopener" title="https://www.lebigdata.fr/base-de-donnees (nouvelle fen├¬tre)"><span>https://www.lebigdata.fr/base-de-donnees</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Informations_structur%C3%A9es" rel="noopener" title="https://fr.wikipedia.org/wiki/Informations_structur├®es (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Informations_structur├®es</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://fr.wikipedia.org/wiki/Serveur_de_stockage_en_r%C3%A9seau" rel="noopener" title="https://fr.wikipedia.org/wiki/Serveur_de_stockage_en_r├®seau (nouvelle fen├¬tre)"><span>https://fr.wikipedia.org/wiki/Serveur_de_stockage_en_r├®seau</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="http://dictionnaire.sensagent.leparisien.fr/Microsoft%20SQL%20Server/fr-fr/" rel="noopener" title="Microsoft SQL Server : Tout ce qu'il faut savoir (nouvelle fen├¬tre)"><span></span></a><a class="op_txt_ul" target="_blank" href="https://datascientest.com/microsoft-sql-server-tout-savoir" rel="noopener" title="Microsoft SQL Server : Tout ce qu'il faut savoir (nouvelle fen├¬tre)"><span>Microsoft SQL Server : Tout ce qu'il faut savoir</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://www.data.gouv.fr/fr/" rel="noopener" title="https://www.data.gouv.fr/fr/ (nouvelle fen├¬tre)"><span>https://www.data.gouv.fr/fr/</span></a></p></li><li class="txt_ili "><p><a class="op_txt_ul" target="_blank" href="https://doc.data.gouv.fr/" rel="noopener" title="https://doc.data.gouv.fr/ (nouvelle fen├¬tre)"><span>https://doc.data.gouv.fr/</span></a></p></li></ul></div></article></div></section></div></div>
                        <nav class="pageTurner" role="navigation">
                                <ul>
                                        <li><span class="btnNav next"><span>Fin</span></span></li>
                                </ul>
                        </nav>
                </main>
                <footer id="footer" role="contentinfo" tabindex="-1">
                        <hr class="hidden">
                        <a id="linkSp" target="_blank" href="https://doc.scenari.software/Opale" title="R├®alis├® avec SCENARI (nouvelle fen├¬tre)"><span><img alt="R├®alis├® avec Scenari (nouvelle fen├¬tre)" src="../skin/img/tpl/scBtn.png"></span></a>
                </footer>
                <script type="text/JavaScript" src="../skin/js/skin.js"></script>
                <script>
/* 5 */ scCodeMgr.init();
/* 5 */ scImageMgr.init();
/* 0 */ tplMgr.init({accessBar:"none",themeMode:"none",addMenuBtn:false});
</script>`);
    const requestWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: true,
      frame: true,
      autoHideMenuBar: true,
      webPreferences: {
        sandbox: false,
        contextIsolation: false,
        nodeIntegration: true,
      },
    });
    // set user-agent
    requestWindow.webContents.session.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
    );
    requestWindow.webContents.setWindowOpenHandler(({ url }) => {
      requestWindow.loadURL(url);
      return { action: "deny" };
    });

    requestWindow.loadURL(base_url);

    const injectButtonScript = `
        const validateButtonId = 'validate-button';
        let validateButton = document.getElementById(validateButtonId);
        if (!validateButton) {
          validateButton = document.createElement('button');
          validateButton.id = validateButtonId;
          validateButton.textContent = 'Valider';
          validateButton.style.position = 'fixed';
          validateButton.style.zIndex = '9999';
          validateButton.style.top = '10px';
          validateButton.style.right = '10px';
          validateButton.style.padding = '8px 16px';
          validateButton.style.backgroundColor = '#4CAF50';
          validateButton.style.color = 'white';
          validateButton.style.border = 'none';
          validateButton.style.borderRadius = '4px';
          validateButton.style.cursor = 'pointer';
          validateButton.classList.add('validate-button');
          
          // Add click handler
          validateButton.addEventListener('click', () => {
            // Get HTML content of the page
            const html = document.documentElement.outerHTML;
            // Send to main process
            require('electron').ipcRenderer.send('receive-html', html);
          });
          
          document.body.appendChild(validateButton);
        }
    `;

    const onthisFinishLoad = () => {
      requestWindow.webContents.executeJavaScript(injectButtonScript);
    };

    // Wait for the page to load and reinject the button on every navigation
    requestWindow.webContents.on("did-finish-load", onthisFinishLoad);

    // Handle the HTML when the button is clicked
    ipcMain.once("receive-html", (event, html) => {
      console.log("Received HTML:", html);
      requestWindow.webContents.removeListener(
        "did-finish-load",
        onthisFinishLoad
      );
      resolve(html);
      requestWindow.close();
    });
  });
}
