import React, {useCallback} from 'react'
import {func, bool, string} from 'prop-types'
import {useDropzone} from 'react-dropzone'

function readFile(file, onUpload) {
  const reader = new FileReader()

  reader.onload = event => {
    onUpload(file, btoa(event.target.result))
  }

  reader.readAsBinaryString(file)
}

function StyledDropzone({onUpload, multiple, width, label}) {
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach(file => readFile(file, onUpload))
    },
    [onUpload],
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop,
    multiple,
  })

  return (
    <div className="dropzone-container" style={{width}}>
      <div
        className="dropzone"
        style={{
          borderColor: isDragActive
            ? '#2196f3'
            : isDragAccept
            ? '#00e676'
            : isDragReject
            ? '#ff1744'
            : '#777',
        }}
        {...getRootProps({isDragActive, isDragAccept, isDragReject})}
      >
        <input {...getInputProps()} />
        {/* TODO: Get translation */}
        <p>{label ? label : 'Drag and drop or click to select picture'}</p>
      </div>
    </div>
  )
}

StyledDropzone.propTypes = {
  onUpload: func.isRequired,
  multiple: bool,
  width: string,
  label: string,
}

StyledDropzone.defaultProps = {
  multiple: false,
  width: '50%',
  label: '',
}

export default StyledDropzone
