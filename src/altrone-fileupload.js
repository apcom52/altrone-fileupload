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
        file: "File",
        maxsize: 'File size must be no more than',
        wrongfiletype: 'Wrong file type',
        success: 'Success',
        error: 'Failed',
        bytes: "B",
        kbytes: "KB",
        mbytes: "MB",
        gbytes: "GB",
        tbytes: "TB"
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
        file: "Файл",
        maxsize: 'Размер файла не должен превышать',
        wrongfiletype: 'Неправильный формат файла',
        success: 'Загружен',
        error: 'Ошибка при загрузке',
        bytes: "Б",
        kbytes: "КБ",
        mbytes: "МБ",
        gbytes: "ГБ",
        tbytes: "ТБ"
    }
};

const locale = fileUploadL8n[document.documentElement.lang];

class FileUpload {
    constructor(element, options = {}) {
        let target = this;
        if (element == null) {
            throw new Error("FileUpload: element is null or undefined");
        }

        target.__element = element;
        target.__maxSize = options.maxSize || 2097152;
        target.__multiple = options.multiple || false;
        target.__name = options.name || "";
        target.__ajax = options.ajax || false;
        target.__data = options.data || {};
        target.__url = options.url || "";
        target.__files = [];
        target.__fileInput = createElement('input', '', target.__element.id + 'finput', { type: 'file', multiple: target.__multiple, name: target.__name});
        target.__fileMaxSizeInput = createElement('input', '', '', { type: 'hidden', name: 'MAX_FILE_SIZE', value: target.__maxSize});
        target.__label = createElement('label', '', '', { for: target.__element.id + 'finput' }, locale.placeholder);
        target.__extensions = options.extensions || [];
        target.__onFileSelectedCallback = options.onFileSelected || null;
        target.__onFileUploadedCallback = options.onFileUploaded || null;
        target.__onFileUploadFailedCallback = options.onFileUploadFailed || null;

        target.__element.classList.add('fileupload--empty');
        target.__element.appendChild(target.__fileMaxSizeInput);
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
            if (!target.__files.length) {
                target.__label.innerText = locale.drop;
            }
        }
    }

    __onDragLeave(e) {
        e.preventDefault();
        let target = this;
        target.__element.classList.remove('fileupload--drag');

        if (target.__element.classList.contains('fileupload--empty')) {
            if (!target.__files.length) {
                target.__label.innerText = locale.placeholder;
            }
        }
    }

    __onDrop(e) {
        let target = this;
        e.preventDefault();

        let dt = e.dataTransfer;
        let files = dt.files;

        if (dt.files) {
            target.__element.classList.remove('fileupload--empty');
            if (!target.__files.length) {
                target.__label.innerText = '';
            }
        }

        Array.from(files).forEach(target.__uploadFile, target);

        target.__element.classList.remove('fileupload--drag');
        if (target.__element.classList.contains('fileupload--empty')) {
            if (!target.__files.length) {
                target.__label.innerText = locale.placeholder;
            }
        }
    }

    __onChange(e) {
        let target = this;

        let files = e.target.files;

        if (files) {
            target.__element.classList.remove('fileupload--empty');
            if (!target.__files.length) {
                target.__label.innerText = '';
            }
        }

        Array.from(files).forEach(target.__uploadFile, target);

        if (target.__element.classList.contains('fileupload--empty')) {
            if (!target.__files) {
                target.__label.innerText = locale.placeholder;
            }
        }
    }

    __onDragOver(e) {
        e.preventDefault();
    }

    __uploadFile(file) {
        let target = this;
        target.__files.push(file);

        if (target.__onFileSelectedCallback) {
            target.__onFileSelectedCallback(target, file);
        }

        let fileCard = createElement('div', 'fileupload-file');
        let fileCardIcon = createElement('div', 'fileupload-file__icon');
        let fileCardInfo = createElement('div', 'fileupload-file__info');
        let fileCardTitle = createElement('div', 'fileupload-file__title', '', {}, file.name);
        let fileCardProgress = createElement('div', 'progress progress--color-blue progress--size-thin');
        let fileCardProgressActive = createElement('div', 'progress__active');

        let fileSize = FileUpload.__humanizeFileSize(file.size);
        const extension = FileUpload.__getExtension(file.name);
        let isTrueExtension = true;
        if (target.__extensions.length && target.__extensions.indexOf(extension.extension) === -1) isTrueExtension = false;
        console.log('is true', isTrueExtension, extension, target.__extensions, target.__extensions.indexOf(extension));
        let fileCardMeta = createElement('div', 'fileupload-file__meta', '', {}, locale[extension.filetype] + ", " + fileSize);

        fileCard.appendChild(fileCardIcon);
        fileCard.appendChild(fileCardInfo);
        fileCardInfo.appendChild(fileCardTitle);
        fileCardInfo.appendChild(fileCardMeta);
        target.__label.appendChild(fileCard);

        if (!isTrueExtension) {
            fileCardInfo.append(createElement('div', 'red-fg font--size-small', '', {}, locale.wrongfiletype));
        }

        if (extension.filetype == 'image') {
            let fileReader = new FileReader();
            fileReader.onload = (fr) => {
                fileCardIcon.style.background = 'url(' + fr.target.result + ') no-repeat center';
                fileCardIcon.style.backgroundSize = 'contain';
            };
            fileReader.readAsDataURL(file);
        } else {
            fileCardIcon.classList.add('fileupload-file__icon--' + extension.filetype);
        }

        if (file.size >= target.__maxSize) {
            fileCardInfo.append(createElement('div', 'red-fg font--size-small', '', {}, locale.maxsize + ' ' + FileUpload.__humanizeFileSize(target.__maxSize)));
        } else {
            if (target.__ajax) {
                fileCardProgress.appendChild(fileCardProgressActive);
                fileCardInfo.appendChild(fileCardProgress);

                let ajax = new XMLHttpRequest();
                ajax.upload.onprogress = (e) => {
                    fileCardProgressActive.style.width = (e.loaded / e.total * 100) + '%';
                };

                ajax.onload = ajax.onerror = function(response) {
                    if (this.status == 200) {
                        fileCardProgress.remove();
                        fileCardInfo.appendChild(createElement('div', 'green-fg font--size-small', '', {}, locale.success));

                        if (target.__onFileUploadedCallback) target.__onFileUploadedCallback(target, file, response);
                    } else {
                        fileCardProgress.remove();
                        fileCardInfo.appendChild(createElement('div', 'red-fg font--size-small', '', {}, locale.error));
                        if (target.__onFileUploadFailedCallback) target.__onFileUploadFailedCallback(target, file, response);
                    }
                };

                let formData = new FormData();
                formData.append(target.__name, file);

                if (target.__data) {
                    Object.keys(target.__data).forEach((current) => {
                       formData.append(current, target.__data[current]);
                    });
                }

                ajax.open("POST", target.__url, true);
                ajax.send(formData);
            }
        }
    }

    static __humanizeFileSize(size) {
        let fileSizeUnits = size == 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, fileSizeUnits)).toFixed(2)*1 + [locale.bytes, locale.kbytes, locale.mbytes, locale.gbytes, locale.tbytes][fileSizeUnits];
    }

    static __getExtension(filename) {
        const fileExtensions = {
            document: ['doc', 'docx', 'docm', 'epub', 'fb2', 'pdf', 'pages', 'key', 'mobi', 'ppt', 'pptm', 'pptx', 'pub', 'rtf', 'txt', 'xls', 'xlsm', 'xlsx'],
            archive: ['7z', 'gzip', 'rar', 'zip', 'tar'],
            image: ['ico', 'png', 'svg', 'bmp', 'gif', 'jpeg', 'jpg'],
            music: ['ac3', 'aif', 'aud', 'flac', 'iff', 'm3u', 'm4a', 'm4b', 'm4r', 'mp3', 'ogg', 'wav', 'wma'],
            app: ['app', 'apk', 'deb', 'exe', 'jar', 'pkg'],
            video: ['3gp', 'avi', 'flv', 'h264', 'mkv', 'mov', 'mp4', 'mpeg', 'mpg', 'webm', 'wmv']
        };

        let ext = filename.toLowerCase().match(/.+\.([a-zA-Z0-9]+)/)[1];
        let filetype = 'file';
        Object.keys(fileExtensions).forEach((current) => {
            if (fileExtensions[current].indexOf(ext) >= 0) {
                filetype = current;
                return;
            }
        });

        return  {
            extension: ext,
            filetype: filetype
        };
    }
}
