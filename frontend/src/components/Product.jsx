import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const navigate = useNavigate();

    const products = [
  { id: 2, img: "/images/fig2.png", name: "Figure 1" },
  { id: 4, img: "/images/fig4.png", name: "Figure 2" },
  { id: 5, img: "/images/fig5.png", name: "Figure 3" },
  { id: 6, img: "/images/fig6.png", name: "Figure 4" },
  { id: 7, img: "/images/fig7.png", name: "Figure 5" },
  { id: 8, img: "/images/fig8.png", name: "Figure 6" },
  { id: 9, img: "/images/fig9.png", name: "Figure 7" },
  { id: 11, img: "/images/fig11.png", name: "Figure 8" },
  { id: 12, img: "/images/fig12.png", name: "Figure 9" },
  { id: 13, img: "/images/fig13.png", name: "Figure 10" },
  { id: 14, img: "/images/fig14.png", name: "Figure 11" },
  { id: 15, img: "/images/fig15.png", name: "Figure 12" },
  { id: 16, img: "/images/fig16.png", name: "Figure 13" },
  { id: 17, img: "/images/fig17.png", name: "Figure 14" },
  { id: 18, img: "/images/fig18.png", name: "Figure 15" },

  { id: 19, img: "/images/fig19.png", name: "Figure 16" },
  { id: 21, img: "/images/fig21.png", name: "Figure 17" },
  { id: 22, img: "/images/fig22.png", name: "Figure 18" },
  { id: 24, img: "/images/fig24.png", name: "Figure 19" },
  { id: 25, img: "/images/fig25.png", name: "Figure 20" },
  { id: 26, img: "/images/fig26.png", name: "Figure 21" },
  { id: 27, img: "/images/fig27.png", name: "Figure 22" },
  { id: 28, img: "/images/fig28.png", name: "Figure 23" },
  { id: 29, img: "/images/fig29.png", name: "Figure 24" },
  { id: 30, img: "/images/fig30.png", name: "Figure 25" },
  { id: 32, img: "/images/fig32.png", name: "Figure 26" },
  { id: 33, img: "/images/fig33.png", name: "Figure 27" },
  { id: 35, img: "/images/fig35.png", name: "Figure 28" },
  { id: 1, img: "/images/fig1.png", name: "Figure 29" },
];

    const imageGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '40px',
        margin: '40px 40px',
        objectFit: 'cover',
        
    };

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = products.slice(indexOfFirst, indexOfLast);

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
               {currentProducts.map((p) => (
                  <div key={p.id} style={imageItem}>
                    <img
                     src={p.img}
                     alt={p.name}
                     style={{ width: "100%" }}
                     className="zoomImage"
                     onClick={() => handleImageClick(p.id, p.img)}
                    />
                    <p>{p.name}</p>
                  </div>
                ))}
            </section>

            <div style={{display:"flex", justifyContent:"center", gap:"10px", marginTop:"20px", marginBottom:"40px"}}>

<button
style={{
padding:"10px 20px",
borderRadius:"8px",
fontSize:"16px",
color:"black",
backgroundColor: currentPage === 2 ? "#ad9551" : ""
}}
onClick={() => setCurrentPage(currentPage - 1)}
disabled={currentPage === 1}
>
{"<< Previous"}
</button>

<button
onClick={() => setCurrentPage(1)}
style={{
padding:"10px 20px",
borderRadius:"8px",
fontSize:"16px",
color:"black",
backgroundColor: currentPage === 2 ? "#ad9551" : ""
}}
>
1
</button>

<button
onClick={() => setCurrentPage(2)}
style={{
padding:"10px 20px",
borderRadius:"8px",
fontSize:"16px",
color:"black",
backgroundColor: currentPage === 1 ? "#ad9551" : ""
}}
>
2
</button>

<button
style={{
padding:"10px 20px",
borderRadius:"8px",
fontSize:"16px",
color:"black",
backgroundColor: currentPage === 1 ? "#ad9551" : ""
}}
onClick={() => setCurrentPage(currentPage + 1)}
disabled={currentPage === 2}
>
{"Next >>"}
</button>

</div>

            
        </div>
    );
}

export default Product;