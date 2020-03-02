import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import axios from 'axios';

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
                        if (response.data.result == 'success') {
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
    plugins: [ MyCustomUploadAdapterPlugin],
    // plugins: [ MyCustomUploadAdapterPlugin, Essentials, Bold, Italic, Paragraph ],
    // toolbar: [ 'bold', 'italic' ]
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