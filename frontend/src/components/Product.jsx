import React from 'react';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const navigate = useNavigate();

    const imageGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '20px',
        margin: '40px 0',
        objectFit: 'cover',
        
    };
    const imageItem = {
        width: "100%",
       
    };
    const handleImageClick = (id, imagePath) => {
     navigate(`/details/${id}`, { state: { image: imagePath } });
   };
    return (
        <div>
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "35px", color: "#cdaf5b" }}>Natural Gem Pendants</h1>
            <p style={{fontFamily: "'Montserrat', sans-serif",fontSize: "20px",color: "#ebe2c7"}}>Explore our curated collection of ethnically sourced natural gemstones <br></br>set in handcrafted 18K and 22K gold.</p>

            <section style={imageGrid}>
                <div style={{imageItem, overFlow:"hidden"}}>
                    <img src="/images/fig2.png" alt="Image 1" style={{width:"100%"}} className="zoomImage"  onClick={() => handleImageClick(2,"/images/fig2.png")} />
                    <p>Figure 1</p>
                    
                </div>
                
                <div style={imageItem} overFlow="hidden">
                    <img src="/images/fig4.png" alt="Image 3" style={{width:"100%"}} className="zoomImage"  onClick={() =>handleImageClick(4,"/images/fig4.png")}/>
                    <p>Figure 2</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig5.png" alt="Image 4" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(5,"/images/fig5.png")} />
                    <p>Figure 3</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig6.png" alt="Image 5" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(6,"/images/fig6.png")} />
                    <p>Figure 4</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig7.png" alt="Image 6" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(7,"/images/fig7.png")} />
                    <p>Figure 5</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig8.png" alt="Image 7" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(8,"/images/fig8.png")} />
                    <p>Figure 6</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig9.png" alt="Image 8" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(9,"/images/fig9.png")} />
                    <p style={{color:"white"}}>Figure 7</p>
                    
                </div>
               
                <div style={imageItem}>
                    <img src="/images/fig11.png" alt="Image 10" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(11,"/images/fig11.png")} />
                    <p>Figure 8</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig12.png" alt="Image 11" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(12,"/images/fig12.png")} />
                    <p>Figure 9</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig13.png" alt="Image 12" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(13,"/images/fig13.png")} />
                    <p>Figure 10</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig14.png" alt="Image 13" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(14,"/images/fig14.png")} />
                    <p>Figure 11</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig15.png" alt="Image 14" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(15,"/images/fig15.png")} />
                    <p style={{color:"white"}}>Figure 12</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig16.png" alt="Image 15" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(16,"/images/fig16.png")} />
                    <p>Figure 13</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig17.png" alt="Image 16" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(17,"/images/fig17.png")} />
                    <p>Figure 14</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig18.png" alt="Image 17" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(18,"/images/fig18.png")} />
                    <p>Figure 15</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig19.png" alt="Image 18" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(19,"/images/fig19.png")} />
                    <p>Figure 16</p>
                    
                </div>
                
                <div style={imageItem}>
                    <img src="/images/fig21.png" alt="Image 20" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(21,"/images/fig21.png")} />
                    <p>Figure 17</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig22.png" alt="Image 21" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(22,"/images/fig22.png")} />
                    <p>Figure 18</p>
                    
                </div>
                
                <div style={imageItem}>
                    <img src="/images/fig24.png" alt="Image 23" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(24,"/images/fig24.png")} />
                    <p>Figure 19</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig25.png" alt="Image 24" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(25,"/images/fig25.png")} />
                    <p>Figure 20</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig26.png" alt="Image 25" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(26,"/images/fig26.png")} />
                    <p>Figure 21</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig27.png" alt="Image 26" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(27,"/images/fig27.png")} />
                    <p>Figure 22</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig28.png" alt="Image 27" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(28,"/images/fig28.png")} />
                    <p>Figure 23</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig29.png" alt="Image 28" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(29,"/images/fig29.png")} />
                    <p>Figure 24</p>
                    
                </div>
                <div style={imageItem}>
                    <img src="/images/fig30.png" alt="Image 29" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(30,"/images/fig30.png")} />
                    <p>Figure 25</p>
                    
                </div>
                  
                <div style={imageItem}>
                    <img src="/images/fig32.png" alt="Image 31" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(32,"/images/fig32.png")} />
                    <p>Figure 26</p>
                    
                </div>  
                <div style={imageItem}>
                    <img src="/images/fig33.png" alt="Image 32" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(33,"/images/fig33.png")} />
                    <p>Figure 27</p>
                    
                </div>
                 
                <div style={imageItem}>
                    <img src="/images/fig35.png" alt="Image 34" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(35,"/images/fig35.png")} />
                    <p>Figure 28</p>
                    
                </div>
                
                
                  
                 
                <div style={imageItem}>
                    <img src="/images/fig1.png" alt="Image 39" style={{width:"100%"}} className="zoomImage" onClick={() =>handleImageClick(1,"/images/fig1.png")} />
                    <p>Figure 29</p>
                    
                </div>
                
            </section>
        </div>
    );
}

export default Product;