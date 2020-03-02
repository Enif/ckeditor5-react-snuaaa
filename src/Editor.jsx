import React from 'react';
import * as CKEditor from 'ckeditor4-react';

function Editor() {
    return (
        <CKEditor
            data="<p>hello ckeditor</p>"
        />
    )
}

export default Editor;