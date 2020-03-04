import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import Image from '@ckeditor/ckeditor5-image/src/image';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import List from '@ckeditor/ckeditor5-list/src/list';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
// import dd from '@ckeditor/ckeditor5-paragraph/src/'

import axios from 'axios';

class InsertImage extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('insertImage', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Insert image',
                icon: imageIcon,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {
                // const imageURL = prompt('Image URL');

                const input = document.createElement('input');

                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = async () => {

                    editor.model.change(writer => {
                        // const imageElement = writer.createElement('image', {
                        //     src: imageURL
                        // });

                        const file = input.files[0];
                        const formData = new FormData();

                        formData.append('attachedImage', file);
                        axios.post('http://192.168.123.100:8080/api/image', formData)
                            .then(res => {
                                const imageElement = writer.createElement('image', {
                                    src: `http://192.168.123.100:8080/static/${res.data.imgPath}`
                                });
                                editor.model.insertContent(imageElement, editor.model.document.selection);

                            }).catch(response => {
                                // reject('Upload failed');
                                alert('upload failed')
                            });


                        // Insert the image in the current selection location.
                        // editor.model.insertContent(imageElement, editor.model.document.selection);
                    });
                }
                input.click();
            });

            return view;
        });
    }
}

class MyUploadAdapter {
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        // Update the loader's progress.
        return this.loader.file
            .then(uploadFile => {
                return new Promise((resolve, reject) => {
                    const data = new FormData();
                    data.append('image', uploadFile);

                    axios.post('http://192.168.123.100:8080/api/image', {
                        // onUploadProgress: (data) => {
                        //     this.loader.uploadTotal = data.total;
                        //     this.loader.uploaded = data.uploaded;
                        // }
                    }).then(response => {
                        if (response.data.result === 'success') {
                            resolve({
                                default: response.data.url
                            });
                        } else {
                            reject(response.data.message);
                        }
                    }).catch(response => {
                        reject('Upload failed');
                    });
                })
            })



        // Return a promise that will be resolved when the file is uploaded.
        // return loader.file
        //     .then(file => server.upload(file));
    }

    // Aborts the upload process.
    abort() {
        // Reject the promise returned from the upload() method.
        console.warn("upload abort")
        // server.abortUpload();
    }
}


function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader);
    };
}


const editorConfiguration = {
    // plugins: [ MyCustomUploadAdapterPlugin],
    plugins: [Essentials, Heading, Bold, Italic, Paragraph, List, TodoList, Image, InsertImage, ImageCaption, Table, TableToolbar, FileRepository, Strikethrough, Subscript, Underline],
    extraPlugins: [MyCustomUploadAdapterPlugin],
    // toolbar: ['bold', 'italic', 'insertImage'],
    toolbar: ['heading', '|', 'bold', 'italic', 'Strikethrough', 'Subscript', '|', 'link', 'bulletedList', 'numberedList', 'todoList', 'blockQuote', '|',
        'undo', 'redo', '|',
        'insertImage', 'insertTable'],
    image: {
        toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative']
    },
    table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    }
};


function Editor5() {
    return (
        <div className="App">
            <h2>Using CKEditor 5 build in React</h2>
            <CKEditor
                editor={ClassicEditor}
                config={editorConfiguration}
                data="<p>Hello from CKEditor 5!</p>"
                onInit={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </div>
    );
}

export default Editor5;