let input = document.querySelector('.entered-list')
let addBtn = document.querySelector('.add-list')
let tasks = document.querySelector('.tasks')
let divPlatosEntradas = document.querySelector('.d_nE')
let divPlatosPrincipal = document.querySelector('.d_nP')
let divPlatosExtra = document.querySelector('.d_nX')
let taskArray = [];
let currentEditId = null;
//Add btn disabled

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        //     taskArray = [];
        //     taskArray = JSON.parse(localStorage.getItem('task'));
        const tasksFromLocalStorage = JSON.parse(localStorage.getItem('task'));
        if (tasksFromLocalStorage) {
            taskArray = tasksFromLocalStorage;
        }
        createHTML();
    });

}

input.addEventListener('keyup', () => {
    let dato_input = input.value.trim();
    if (dato_input != 0) {
        addBtn.classList.add('active')
    } else {
        addBtn.classList.remove('active')
    }
})


//Add new item to list
addBtn.addEventListener('click', () => {
    const taskInputValue = input.value.trim();
    //platospan esta oculto, de ahi capto que es si es entrada,principal o extra
    let platosSpan = document.getElementById('platosXD');
    let valorPlatoSpan = platosSpan.innerHTML.trim();

    if (!valorPlatoSpan) {
        alert('Seleccione una categoría (Entrada, Principal o Extras) antes de añadir.');
        return;
    }

    if (taskInputValue !== "") {
        if (currentEditId) {
            // update existing
            taskArray = taskArray.map(t => t.id === currentEditId ? { ...t, taskInputValue, plato: valorPlatoSpan } : t);
            currentEditId = null;
            addBtn.textContent = 'Add';
            addBtn.classList.remove('editing');
        } else {
            const tasksObj = {
                taskInputValue,
                id: Date.now(),
                plato: valorPlatoSpan
            }
            taskArray = [...taskArray, tasksObj]
        }
        createHTML();
        input.value = "";
        addBtn.classList.remove('active');
    } else {
        alert('Por favor ingrese un plato');
    }
})


function createHTML() {
    clearHTML();
    const selectedCategory = document.getElementById('platosXD').innerHTML.trim();

    if (taskArray.length > 0) {
        taskArray.forEach(element => {
            // Show in task list only if it matches the selected category (or if none selected show all)
            if (!selectedCategory || element.plato === selectedCategory) {
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.innerHTML = `
                    <p> ${element.taskInputValue} </p>
                    <div class="item-btn">
                    <i task-id="${element.id}" class="fa-solid fa-pen-to-square"></i>
                    <i task-id="${element.id}" class="fa-solid fa-xmark"></i>
                    </div>
                    `
                tasks.appendChild(newItem);
            }

            // Append to the appropriate carta container (keeps right-side grouped by category)
            const elementoWrapCarta = document.querySelectorAll(".wrapCarta")
            elementoWrapCarta.forEach(function (elementoNamePlato) {
                let valorDelAtributoDelPlato = elementoNamePlato.getAttribute('data-name-plato');
                if (valorDelAtributoDelPlato === element.plato) {
                    let newItemCarta = document.createElement('div');
                    newItemCarta.classList.add('plato-carta');
                    newItemCarta.innerHTML = `
                        <div class="title-plato-carta">
                            <h4 task-id="${element.id}">${element.taskInputValue}</h4>
                        </div>`;
                    elementoNamePlato.appendChild(newItemCarta);
                }
            });

        });
    }
    sincronizarLocalStorage();
}

function clearHTML() {
    tasks.innerHTML = "";
    divPlatosEntradas.innerHTML = "";
    divPlatosPrincipal.innerHTML = "";
    divPlatosExtra.innerHTML = "";
}


function sincronizarLocalStorage() {
    localStorage.setItem('task', JSON.stringify(taskArray))
}

// Helper: carga un script externo dinámicamente y espera a que cargue
function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
        const exists = document.querySelector('script[src="' + src + '"]');
        if (exists) {
            // Ya existe: si la librería ya está disponible, resolvemos
            if ((typeof html2canvas !== 'undefined') || (typeof window.jspdf !== 'undefined')) {
                resolve();
                return;
            }
            exists.addEventListener('load', () => resolve());
            exists.addEventListener('error', () => reject(new Error('Failed to load ' + src)));
            return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.crossOrigin = 'anonymous';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load ' + src));
        document.head.appendChild(s);
    });
}

// Small loader overlay used while generating
function showLoader() {
    if (document.getElementById('carta-loader')) return;
    const overlay = document.createElement('div');
    overlay.id = 'carta-loader';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.zIndex = '10000';

    const box = document.createElement('div');
    box.style.padding = '18px';
    box.style.borderRadius = '8px';
    box.style.background = '#fff';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.gap = '10px';

    const spinner = document.createElement('div');
    spinner.style.width = '28px';
    spinner.style.height = '28px';
    spinner.style.border = '4px solid #ccc';
    spinner.style.borderTopColor = '#2c3e50';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'carta-spin 1s linear infinite';

    const text = document.createElement('div');
    text.textContent = 'Generando carta...';
    text.style.fontSize = '14px';
    text.style.color = '#222';

    box.appendChild(spinner);
    box.appendChild(text);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function hideLoader() {
    const el = document.getElementById('carta-loader');
    if (el) el.remove();
}

//delete item from list
tasks.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-xmark')) {
        const deleteID = parseInt(e.target.getAttribute('task-id'));
        taskArray = taskArray.filter(task => task.id !== deleteID);
        createHTML();
    }

})

//edit item on pen click
tasks.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-pen-to-square')) {
        const editID = parseInt(e.target.getAttribute('task-id'));
        const task = taskArray.find(t => t.id === editID);
        if (task) {
            input.value = task.taskInputValue;
            currentEditId = editID;
            let miDivButtonAdd = document.getElementById('todoList');
            miDivButtonAdd.style.display = 'block';
            let platos = document.getElementById('platosXD');
            platos.innerHTML = task.plato;
            // Re-render left task list to show only this category while editing
            createHTML();
            addBtn.textContent = 'Add';
            addBtn.classList.add('editing','active');
            input.focus();
        }
    }
})


/* ========================= */

const triggerTabList = document.querySelectorAll('#nav-tab button');

triggerTabList.forEach(triggerEl => {
    triggerEl.addEventListener('click', event => {
        let platos = document.getElementById('platosXD');
        let miDivButtonAdd = document.getElementById('todoList');
        miDivButtonAdd.style.display = 'block';
        // Extract the type from data-bs-target -> "#nav-entrada" => "entrada"
        const target = triggerEl.getAttribute('data-bs-target') || event.currentTarget.getAttribute('data-bs-target');
        const selected = target.replace('#nav-','').replace('#','');
        platos.innerHTML = selected;
        // Re-render tasks so the left list shows only the selected category
        createHTML();
    })
})

// Generar carta -> generar preview y dar opciones (descargar PNG / exportar PDF)
const generarBtn = document.getElementById('generarCartaBtn');
if (generarBtn) {
    generarBtn.addEventListener('click', async () => {
        try {
            generarBtn.disabled = true;
            generarBtn.textContent = 'Generando...';
            showLoader();
            console.log('Inicio generación de carta');
            const canvas = await generateCartaCanvas();
            console.log('Canvas generado, mostrando previsualización');
            await showPreviewModal(canvas);
        } catch (err) {
            console.error('Error generando carta:', err);
            alert('Ocurrió un error al generar la carta. Revisa la consola para más detalles.');
        } finally {
            hideLoader();
            generarBtn.disabled = false;
            generarBtn.textContent = 'Generar Carta';
        }
    });
}

async function generateCartaCanvas() {
    const tasks = JSON.parse(localStorage.getItem('task')) || [];

    const temp = document.createElement('div');
    temp.className = 'menu-container';
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    temp.style.top = '0';
    // Intentar convertir la imagen de fondo a data URL para evitar problemas de CORS
    try {
        const dataUrl = await (async function urlToDataURL(url) {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error('Fetch failed: ' + res.status);
                const blob = await res.blob();
                return await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error('FileReader failed'));
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                console.warn('No se pudo obtener dataURL de', url, e);
                throw e;
            }
        })('carta.jpg');
        temp.style.backgroundImage = `url("${dataUrl}")`;
        console.log('Imagen carta.jpg incrustada como data URL');
    } catch (e) {
        console.warn('No se pudo incrustar carta.jpg; permanecerá sin fondo. Si vas a exportar la imagen asegúrate de abrir el proyecto vía HTTP (ej. http://localhost/...) y de que la imagen esté accesible con CORS.');
    }

    temp.style.backgroundSize = 'contain';
    temp.style.backgroundRepeat = 'no-repeat';
    temp.style.backgroundPosition = 'center';
    temp.style.padding = '80px 60px';
    temp.style.width = '800px';
    temp.style.boxSizing = 'border-box';
    temp.style.backgroundColor = '#ffffff';

    const h1 = document.createElement('h1');
    h1.textContent = 'MENÚ';
    h1.style.textAlign = 'center';
    h1.style.fontSize = '48px';
    h1.style.letterSpacing = '4px';
    h1.style.marginBottom = '40px';
    temp.appendChild(h1);

    function appendSection(titleText, tipo) {
        const h2 = document.createElement('h2');
        h2.textContent = titleText;
        h2.style.textAlign = 'center';
        h2.style.fontSize = '20px';
        h2.style.letterSpacing = '3px';
        h2.style.margin = '40px 0 20px';
        h2.style.fontWeight = '600';
        temp.appendChild(h2);

        const ul = document.createElement('ul');
        ul.style.listStyle = 'disc';
        ul.style.width = 'fit-content';
        ul.style.margin = '0 auto';

        const items = tasks.filter(t => t.plato === tipo);
        if (items.length === 0) {
            const li = document.createElement('li');
            li.textContent = '—';
            li.style.fontSize = '18px';
            li.style.fontStyle = 'italic';
            li.style.lineHeight = '1.6';
            ul.appendChild(li);
        } else {
            items.forEach(it => {
                const li = document.createElement('li');
                li.textContent = it.taskInputValue;
                li.style.fontSize = '18px';
                li.style.fontStyle = 'italic';
                li.style.lineHeight = '1.6';
                ul.appendChild(li);
            });
        }
        temp.appendChild(ul);
    }

    appendSection('ENTRANTE', 'entrada');
    appendSection('PLATOS PRINCIPALES', 'principal');
    appendSection('PLATOS EXTRAS', 'extra');

    document.body.appendChild(temp);

    await new Promise(r => setTimeout(r, 100));

    // Asegurar que html2canvas está disponible (carga dinámica si hace falta)
    try {
        if (typeof html2canvas === 'undefined') {
            console.log('html2canvas no detectado; intentando cargar desde CDN...');
            await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            console.log('Carga dinámica de html2canvas completada.');
        }
    } catch (loadErr) {
        console.error('No se pudo cargar html2canvas:', loadErr);
        throw new Error('No se pudo cargar la librería html2canvas. Comprueba la conexión o el bloqueador de scripts.');
    }

    let canvas;
    try {
        canvas = await html2canvas(temp, { scale: 2, useCORS: true, backgroundColor: null });
    } catch (cnvErr) {
        console.error('html2canvas falló al renderizar:', cnvErr);
        throw new Error('Error al renderizar la carta con html2canvas: ' + cnvErr.message);
    }

    temp.remove();
    return canvas;
}

async function showPreviewModal(canvas) {
    // build modal
    const overlay = document.createElement('div');
    overlay.className = 'carta-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'carta-modal';

    const img = document.createElement('img');
    img.className = 'carta-preview';
    try {
        img.src = canvas.toDataURL('image/png');
    } catch (err) {
        console.error('No se puede exportar canvas a dataURL; se debe a una imagen tainted (CORS):', err);
        // Mostrar mensaje de ayuda en el modal
        const help = document.createElement('div');
        help.style.padding = '12px';
        help.style.color = '#a00';
        help.innerHTML = `<strong>No se pudo generar la imagen:</strong> La carta contiene una imagen que impide la exportación por motivos de seguridad (CORS).<br>
        Soluciones:
        <ul>
          <li>Abre el proyecto desde un servidor local (ej.: <code>http://localhost/2026/restaurante/</code>) en vez de usar <code>file://</code>.</li>
          <li>Asegura que la imagen <code>carta.jpg</code> esté servida desde el mismo origen o tenga cabeceras CORS que permitan su uso.</li>
          <li>Alternativa: colocar la imagen como data URL en el CSS o en el atributo <code>style</code>.</li>
        </ul>`;
        modal.appendChild(help);
        modal.appendChild(document.createElement('br'));
        modal.appendChild(img);
        img.alt = 'Export no disponible (CORS)';
        img.style.opacity = '0.6';
    }
    if (!img.src) {
        // canvas no pudo exportarse; mostrar (siempre) la imagen en modo fall-back usando toDataURL podría no funcionar
        // intentamos usar canvas.toBlob como opción, pero si el canvas está tainted, también fallará
        // dejamos el img sin src para que el help lo explique
    }
    modal.appendChild(img);

    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn-primary';
    downloadBtn.textContent = 'Descargar PNG';
    downloadBtn.addEventListener('click', () => {
        const now = new Date();
        const fname = `carta-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}.png`;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = fname;
        document.body.appendChild(link);
        link.click();
        link.remove();
    });

    const pdfBtn = document.createElement('button');
    pdfBtn.className = 'btn-outline';
    pdfBtn.textContent = 'Exportar PDF';
    pdfBtn.addEventListener('click', async () => {
        try {
            if (typeof window.jspdf === 'undefined') {
                await loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            }
            const { jsPDF } = window.jspdf;
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            // fit image into pdf page
            const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
            const imgWidth = canvas.width * ratio;
            const imgHeight = canvas.height * ratio;
            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            const now = new Date();
            const fname = `carta-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}.pdf`;
            pdf.save(fname);
        } catch (e) {
            console.error('Error exporting PDF', e);
            alert('No se pudo exportar a PDF. Revisa la consola.');
        }
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-outline';
    closeBtn.textContent = 'Cerrar';
    closeBtn.addEventListener('click', () => {
        overlay.remove();
    });

    actions.appendChild(closeBtn);
    actions.appendChild(pdfBtn);
    actions.appendChild(downloadBtn);
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}


