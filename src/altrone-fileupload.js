class FileUpload {
    constructor(element, options = {}) {
        let target = this;
        if (element == null) {
            throw new Error("FileUpload: element is null or undefined");
        }

        target.__element = element;
        target.__inArea = false;

        let onDragEnterHandler = (e) => target.__onDragEnter(e);
        let onDragLeaveHandler = (e) => target.__onDragLeave(e);
        let onDragOverHandler = (e) => target.__onDragOver(e);
        let onDropHandler = (e) => target.__onDrop(e);

        target.__element.addEventListener('dragenter', onDragEnterHandler, false);
        target.__element.addEventListener('dragleave', onDragLeaveHandler, false);
        target.__element.addEventListener('dragover', onDragOverHandler, false);
        target.__element.addEventListener('drop', onDropHandler, false);
    }

    __onDragEnter(e) {
        e.preventDefault();
        let target = this;
        target.__element.classList.add('fileupload--drag');
        target.__inArea = true;

        if (target.__element.classList.contains('fileupload--empty')) {
            target.__element.innerText = "Отпустите, чтобы начать загрузку";
        }

        console.log('on drag enter');

    }

    __onDragLeave(e) {
        e.preventDefault();
        let target = this;
        target.__element.classList.remove('fileupload--drag');

        if (target.__element.classList.contains('fileupload--empty')) {

            target.__element.innerText = "Перетащите или выберите файлы для загрузки";
        }

        console.log('on drag leave');
    }

    __onDragOver(e) {
        e.preventDefault();
        let target = this;

        if (target.__inArea) {

        }
        console.log('on drag over');
    }

    __onDrop(e) {
        e.preventDefault();
        console.log('on drop');
    }
}
