# Altrone FileUpload Plugin
Плагин для Altrone-CSS. Позволяет добавлять на страницу компонент для загрузки файлов на сервер.

**Текущая версия:** 1.0

**Требования**:
* Altrone 3.1 и выше

**Возможности:**
* Выбор файлов по нажатию на компонент или методом перетаскивания
* Светлая и темная тема оформления
* Поддержка callback-функций
* Множество параметров настройки

**Демонстрация:**
![Image of Yaktocat](https://github.com/apcom52/altrone-fileupload/blob/master/anim.gif)

**Использование:**
```html
<div class="fileupload" id="fileupload_demo"></div>
```

```javascript
let fileupload_demo = new FileUpload(document.getElementById('fileupload_demo'), {
    name: 'files',
    maxSize: 209715200,
    extensions: ['jpg', 'jpeg', 'png']
});
```

**Параметры настройки:**
* __maxSize__ (int) - максимальный размер (в байтах). При указании этого параметра, создается дополнительный ```<input type="hidden" name="MAX_FILE_SIZE" value="xxx">```, который содержит значение этого параметра (не обязательный).
* __multiple__ (Boolean) - позволяет загружать сразу несколько файлов. По умолчанию false.
* __name__ (String) - задает значение атрибута name у поля input. Обязательный параметр. По умолчанию пустая строка.
* __ajax__ (Boolean) - позволяет включить автоматическую загрузку файлов (методом AJAX). Всегда отправляется только POST запрос. Необходимо указать параметр url. По умолчанию false.
* __data__ (Object) - дополнительные параметры для ajax. Использовать только при использовании ajax-загрузки. По умочанию пустой объект.
* __url__ (String) - URL-адрес на который отправляется ajax запрос. Использовать только при использолвании ajax-загрузки. По умолчанию пустая строка.
* __extensions__ (Array<String>) - белый список расширений файлов. Внимание: даже если файл не внесен в список, то он добавляется в форму загрузки. Необходима дополнительная проверка на сервере.
* __onFileSelected(fileupload, file)__ (Function) - функция, которая будет запускаться при выборе файла. Первый параметр - объект FileUpload, второй - объект загруженного файла.
* __onFileUploaded(fileupload, file, response)__ (Function) - функция, которая будет запускаться при успешной загрузке файла (через ajax). Первый параметр - объект FileUpload, второй - объект загруженного файла, третий - ответ от сервера.
* __onFileUploadFailed(fileupload, file, response)__ (Function) - функция, которая будет запускаться при неудачной загрузке файла (через ajax). Первый параметр - объект FileUpload, второй - объект загруженного файла, третий - ответ от сервера.