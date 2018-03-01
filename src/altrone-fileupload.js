const fileUploadL8n = {
    en: {
        placeholder: "Drag or choose files to upload",
        drop: "Drop file to upload",
        document: "Document",
        image: "Image",
        app: "Application",
        video: "Video",
        archive: "Archive",
        music: "Audio",
    },
    ru: {
        placeholder: "Перетащите или выберите файл для загрузки",
        drop: "Отпустите файл, чтобы начать загрузку",
        document: "Документ",
        image: "Изображение",
        app: "Приложение",
        video: "Видео",
        archive: "Архив",
        music: "Аудио",
    }
};

const locale = fileUploadL8n[document.documentElement.lang];
console.log(locale);

class FileUpload {
    constructor(element, options = {}) {
        let target = this;
        if (element == null) {
            throw new Error("FileUpload: element is null or undefined");
        }

        target.__element = element;
        target.__files = [];
        target.__fileInput = createElement('input', '', target.__element.id + 'finput', { type: 'file', multiple: true});
        target.__label = createElement('label', '', '', { for: target.__element.id + 'finput' }, locale.placeholder);

        target.__element.appendChild(target.__fileInput);
        target.__element.appendChild(target.__label);

        let onDragEnterHandler = (e) => target.__onDragEnter(e);
        let onDragLeaveHandler = (e) => target.__onDragLeave(e);
        let onDragOverHandler = (e) => target.__onDragOver(e);
        let onDropHandler = (e) => target.__onDrop(e);
        let onChangeHandler = (e) => target.__onChange(e);

        target.__label.addEventListener('dragenter', onDragEnterHandler, false);
        target.__label.addEventListener('dragleave', onDragLeaveHandler, false);
        target.__label.addEventListener('dragover', onDragOverHandler, false);
        target.__label.addEventListener('drop', onDropHandler, false);
        target.__fileInput.addEventListener('change', onChangeHandler, false);
    }

    __onDragEnter(e) {
        e.preventDefault();
        let target = this;
        target.__element.classList.add('fileupload--drag');
        target.__inArea = true;

        if (target.__element.classList.contains('fileupload--empty')) {
            if (!target.__files) {
                target.__label.innerText = locale.drop;
            }
        }
    }

    __onDragLeave(e) {
        e.preventDefault();
        let target = this;
        target.__element.classList.remove('fileupload--drag');

        if (target.__element.classList.contains('fileupload--empty')) {
            if (!target.__files) {
                target.__label.innerText = locale.placeholder;
            }
        }
    }

    __onDragOver(e) {
        e.preventDefault();
    }

    __onDrop(e) {
        let target = this;
        target.__files = [];
        e.preventDefault();

        let dt = e.dataTransfer;
        let files = dt.files;

        if (dt.files) {
            target.__element.classList.remove('fileupload--empty');
            target.__label.innerText = '';
        }

        Array.from(files).forEach(target.__uploadFile, target);

        target.__element.classList.remove('fileupload--drag');
        if (target.__element.classList.contains('fileupload--empty')) {
            if (!target.__files) {
                target.__label.innerText = locale.placeholder;
            }
        }
    }

    __onChange(e) {
        let target = this;

        let files = e.target.files;

        if (files) {
            target.__element.classList.remove('fileupload--empty');
            target.__label.innerText = '';
        }

        Array.from(files).forEach(target.__uploadFile, target);

        if (target.__element.classList.contains('fileupload--empty')) {
            if (!target.__files) {
                target.__label.innerText = locale.placeholder;
            }
        }
    }

    __uploadFile(file) {
        let target = this;
        target.__files.push(file);

        let fileCard = createElement('div', 'fileupload-file');
        let fileCardIcon = createElement('div', 'fileupload-file__icon');
        let fileCardInfo = createElement('div', 'fileupload-file__info');
        let fileCardTitle = createElement('div', 'fileupload-file__title', '', {}, file.name);
        let fileCardMeta = createElement('div', 'fileupload-file__meta', '', {}, locale.document + ", " + (file.size / 8 / 1024) + "KB");

        fileCard.appendChild(fileCardIcon);
        fileCard.appendChild(fileCardInfo);
        fileCardInfo.appendChild(fileCardTitle);
        fileCardInfo.appendChild(fileCardMeta);
        target.__label.appendChild(fileCard);
    }
}
