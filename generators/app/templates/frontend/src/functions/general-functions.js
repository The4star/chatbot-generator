import jsPDF from 'jspdf'

import { deployedURL }  from '../helpers/variables'

// method for getting injection script
const getInjectionScript = () => {
  let injectionScript = `<div id="vicbot"></div>`
  const scripts = document.querySelectorAll('script')
  const links = document.querySelectorAll('link')

  scripts.forEach(script => {
    if (script.id !== "dataslayerLaunchMonitors") {
        if (script.src) {
            injectionScript += `<script src="${script.src}"></script>`
            } else {
            injectionScript += script.outerHTML
        }
    }
    
  })

  links.forEach((link, i) => {
    if(!injectionScript.includes(`<link href="${link.href}" rel="stylesheet">`))
      injectionScript += `<link href="${link.href}" rel="stylesheet">`
  })
  copyToClipboard(injectionScript)
  alert("injectionScript has been copied to the clipboard. You may now paste it into Google Tag Manager.")
  
  }

  // method for copying to clipboard
  const copyToClipboard = (str) => {

    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '')
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  
  // checking if bot is hosted on the deployed site
  // and not being rendered on a seperate site
  // by injection script
  const isDeployedSite = () => {
    if (window.location.href === deployedURL) {
      return true
    }
  }
  
  // method to print what's in the message window.
  const printConversation = () => {
    const mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title> Vic Bot Chat Transcript </title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1> Vic Bot Chat Transcript </h1>');
    mywindow.document.write(document.querySelector(".messages-container").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;

  }
// method to download whats in the message window.
  const downloadConversation = () => {

    const mywindow = window.open('', 'height=400,width=600');

    mywindow.document.write('<html><head><title> Vic Bot Chat Transcript </title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1> Vic Bot Chat Transcript </h1>');
    mywindow.document.write(document.querySelector(".messages-container").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    const doc = new jsPDF()
    const content = mywindow.document.body
    doc.fromHTML(content, 20, 20)
    doc.save('conversation-history.pdf')
    return true;
  }

  const handleUpload = (e) => {
    console.log(e)
    alert('this button will handle uploads when we decide what to do with them.')
  }

  // make the send button firm if the user has 
  // typed anything.
  const changeButtonStyles = (e) => {
    
    if (e.target.value !== "") {
        setTimeout(() => {
            if(!document.querySelector(".submit-active")) {
                const button = document.querySelector(".submit");
                button.classList = "submit-active"   
            }
        }, 100)
    } else {
        setTimeout(() => {
            if(!document.querySelector(".submit")) {
                const button = document.querySelector(".submit-active");
                button.classList = "submit"   
            }
        }, 100)
    }
}
// format the agent's name
const formatName = (unformattedAuthor) => {
  return unformattedAuthor.split("_2E").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

// format bullet points.
const formatHyphens = (messagetoFormat) => {
  return messagetoFormat.replace(/\s-/g, "\n\n&#8226;").replace(/-/g, "&#8208;");
}

  export {
      copyToClipboard,
      getInjectionScript,
      downloadConversation,
      printConversation,
      isDeployedSite,
      handleUpload,
      changeButtonStyles,
      formatName,
      formatHyphens
  }