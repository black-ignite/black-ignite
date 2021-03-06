import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import './EditCategory.css';
import LinearProgress from '@material-ui/core/LinearProgress';

class PosterDropzone extends Component {
  state = {
    posterUrl: '',
    uploadPercentage: 0
  }

  // Calling dataToSend function with fileUrl info
  handleFinishedUpload = async(info) => {
    this.dataToSend(info);
  }

  // Setting local state to file url
  dataToSend  = async(info) => {
    await
      this.setState({
        posterUrl: info.fileUrl
      });
      this.props.setEditedPosterState(this.state.posterUrl);
  }

  // Progression of uplaod
  onUploadProgress = (percent) => { 
    this.setState({
      uploadPercentage: percent
    });
  }

  render() {
    const uploadOptions = {}
    const s3Url = `http://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com`;
    const dropZoneStyle = {
      height: '150px',
      width: '150px',
      border: '2px dashed',
      borderRadius: '4px',
      borderColor: '#246399',
      display: 'flex',
      flexWrap: 'wrap',
      cursor: 'pointer',
      backgroundImage: 'url(/upload-image-white-background.png)',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat'
    }
    return (
      <>
        <DropzoneS3Uploader
          onFinish={this.handleFinishedUpload}
          s3Url={s3Url}
          accept="image/*,audio/*,video/*"
          upload={uploadOptions}
          style={dropZoneStyle}
          onProgress={this.onUploadProgress}
        />
        <LinearProgress 
          className="editProgressBar"
          variant="determinate" 
          value={this.state.uploadPercentage}
        />
      </>
    );
  }
}

export default connect(mapStoreToProps)(PosterDropzone);