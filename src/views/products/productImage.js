import {useHistory, useParams} from "react-router";
import {Button} from "@mui/material";

const ProductImage = () => {
    const history = useHistory();
    const {productId} = useParams();
    const {imageName} = useParams();

    //todo: da se istilizira ova 100 pati podobro, i na slikite da ima onHover mouse pointer cursor da bide

    return (
        <div className="d-flex align-items-center justify-content-center container">
            <Button
                onClick={() => history.push(`/products/${productId}`)}
            >Back</Button>
            <br/>
            <img
                src={`http://localhost:8080/api/products/images/${productId}/o/${imageName}`}
                className={'img-fluid'}
            />
        </div>
    );
}

export default ProductImage;