import React, { Component } from 'react';
import Button from "@mui/material/Button";
import {Radio} from "@mui/material";

class ImageUploadComponent extends Component {

    fileObj = [];
    fileArray = [];
    productId = -1;

    allImageFileTypes = [
        '.tif', '.pjp', '.xbm', '.jxl', '.svgz', '.jpg', '.jpeg', '.ico', '.tiff', '.gif',
        '.svg', '.jfif', '.webp', '.png', '.bmp', '.pjpeg', '.avif'
    ]

    constructor(props) {
        super(props)
        this.state = {
            images: [],
            mainImage: 0
        }
        this.productId = this.props.productId;
        this.changeMainImage = this.changeMainImage.bind(this)
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.removeImage = this.removeImage.bind(this)
        this.initImages()
    }

    async initImages(){
        let mainImage = 0;
        if(this.productId !== -1){
            let imagePaths = [];
            await fetch("http://localhost:8080/api/products/images/" + this.productId, { method: 'GET' })
                .then(response => response.json())
                .then(data => imagePaths = data);
            await fetch("http://localhost:8080/api/products/images/main/" + this.productId, { method: 'GET' })
                .then(response => response.text())
                .then(data => mainImage = data);
            for(let i=0; i<imagePaths.length; i++){
                this.fileObj.push("http://localhost:8080/api/products/images/" + this.productId + "/s/" + imagePaths[i]);
                this.fileArray.push("http://localhost:8080/api/products/images/" + this.productId + "/s/" + imagePaths[i]);
                if(imagePaths[i]===mainImage){
                    mainImage = i+1
                }
            }
            this.setState({ images: this.fileObj, mainImage: mainImage })
            this.handleImageChange(this.fileObj, mainImage)
        }
    }

    removeImageRemotely(image_id){
        this.props.removeImageRemotely(image_id)
    }

    handleImageChange(images, mainImage){
        this.props.handleImagesChange({images, mainImage})
    }

    changeMainImage(e){
        this.setState({mainImage: Number(e.target.value)})
        this.handleImageChange(this.state.images, Number(e.target.value))
    }

    uploadMultipleFiles(e) {
        for (let i = 0; i < e.target.files.length; i++){
            if(this.allImageFileTypes.includes(
                e.target.files[i].name.toLowerCase().substring(e.target.files[i].name.lastIndexOf("."))
            )){
                this.fileObj.push(e.target.files[i]);
                this.fileArray.push(URL.createObjectURL(e.target.files[i]))
            }
        }
        this.setState({ images: this.fileObj })
        this.handleImageChange(this.fileObj, this.state.mainImage)
    }

    removeImage(i) {
        this.fileObj.splice(i, 1)
        const removedImage = this.fileArray.splice(i, 1)[0]
        if(removedImage.substring(0, 4) !== "blob"){
            const parts = removedImage.split("/")
            this.removeImageRemotely(Number(parts[parts.length-1].replace('.jpg', '')))
        }
        let mainImage = 0
        if(this.state.images.length > 1){
            if(i+1<this.state.mainImage)
                mainImage = this.state.mainImage - 1
            else if(i+1>this.state.mainImage)
                mainImage = this.state.mainImage
        }
        this.setState({ images: this.fileObj, mainImage: mainImage })
        this.handleImageChange(this.fileObj, mainImage)
    }

    render() {
        return (
            <form className={'row'}>
                <div className="form-group multi-preview row">
                    {(this.fileArray || []).map((url, i) => (
                        <div className={'col-2 position-relative'}>
                            <Button
                                variant="contained"
                                size={"small"}
                                className="position-absolute bg-danger p-0"
                                onClick={() => this.removeImage(i)}
                            >X</Button>
                            <br/>
                            <Radio
                                checked={this.state.mainImage === i+1}
                                size={"small"}
                                className={"position-absolute bottom-0 end-0 bg-dark text-white ms-5 mt-5"}
                                onChange={this.changeMainImage}
                                value={i+1}
                                name="mainImage"/>
                            <img src={url} alt="..." className={"img-thumbnail border-3"}/>
                        </div>
                    ))}

                    <div className={'col-2 d-flex align-items-center'}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                                document.getElementById("imageUpload").click();
                            }}
                            >+</Button>
                    </div>
                </div>

                <div className="form-group col mt-3">
                    <input id="imageUpload" type="file" hidden className="form-control" accept={"image/*"} onChange={this.uploadMultipleFiles} multiple />
                </div>
            </form >
        )
    }
}

export default ImageUploadComponent;