const Home = () => {
    const videoGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        margin: '40px 0',
    };
    const videoItem = {
        width: '100%',
    };
    const imageGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        margin: '40px 0',
        objectFit: 'cover',
        
    };
    const imageItem = {
        width: "100%",
       
    };
    
        
    const video = {
        width: '100%',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        aspectRatio: '1/1',
        objectFit: 'cover',
        cursor: 'pointer',
    };
    const handleMouseOver = (e) => {
        e.target.play();
    };

    const handleMouseOut = (e) => {
        e.target.pause();
        e.target.currentTime = 0;
    };
    const containerStyle = {
        textAlign: 'center',
    };
    const buttonStyle = {
        
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        backgroundColor: "#ad9551",
        color: "white",
        borderRadius: "6px",
        marginTop: "8px",
    };
    return (
        <>
            <section style={videoGrid}>
                <div style={videoItem}>
                    <video style={video} muted onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >
                        <source src="/videos/video1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={videoItem}>
                    <video style={video} muted onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >
                        <source src="/videos/video2.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={videoItem}>
                    <video style={video} muted onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >
                        <source src="/videos/video3.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={videoItem}>
                    <video style={video} muted onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >
                        <source src="/videos/video4.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </section>
            <div style={containerStyle}>
                <h1>DISCOVER OUR COLLECTIONS</h1>
                <p>Elevate your look with pieces that take center stage</p>
            </div>
            <section style={imageGrid}>
                <div style={imageItem}>
                    <img src="/images/fig2.png" alt="Image 1" style={imageItem} />
                    <p>Figure 1</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                
                <div style={imageItem}>
                    <img src="/images/fig4.png" alt="Image 3" style={imageItem} />
                    <p>Figure 2</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig5.png" alt="Image 4" style={imageItem} />
                    <p>Figure 3</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig6.png" alt="Image 5" style={imageItem} />
                    <p>Figure 4</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig7.png" alt="Image 6" style={imageItem} />
                    <p>Figure 5</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig8.png" alt="Image 7" style={imageItem} />
                    <p>Figure 6</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig9.png" alt="Image 8" style={imageItem} />
                    <p>Figure 7</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
               
                <div style={imageItem}>
                    <img src="/images/fig11.png" alt="Image 10" style={imageItem} />
                    <p>Figure 8</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig12.png" alt="Image 11" style={imageItem} />
                    <p>Figure 9</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig13.png" alt="Image 12" style={imageItem} />
                    <p>Figure 10</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig14.png" alt="Image 13" style={imageItem} />
                    <p>Figure 11</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig15.png" alt="Image 14" style={imageItem} />
                    <p>Figure 12</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig16.png" alt="Image 15" style={imageItem} />
                    <p>Figure 13</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig17.png" alt="Image 16" style={imageItem} />
                    <p>Figure 14</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig18.png" alt="Image 17" style={imageItem} />
                    <p>Figure 15</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig19.png" alt="Image 18" style={imageItem} />
                    <p>Figure 16</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                
                <div style={imageItem}>
                    <img src="/images/fig21.png" alt="Image 20" style={imageItem} />
                    <p>Figure 17</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig22.png" alt="Image 21" style={imageItem} />
                    <p>Figure 18</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                
                <div style={imageItem}>
                    <img src="/images/fig24.png" alt="Image 23" style={imageItem} />
                    <p>Figure 19</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig25.png" alt="Image 24" style={imageItem} />
                    <p>Figure 20</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig26.png" alt="Image 25" style={imageItem} />
                    <p>Figure 21</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig27.png" alt="Image 26" style={imageItem} />
                    <p>Figure 22</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig28.png" alt="Image 27" style={imageItem} />
                    <p>Figure 23</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig29.png" alt="Image 28" style={imageItem} />
                    <p>Figure 24</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                <div style={imageItem}>
                    <img src="/images/fig30.png" alt="Image 29" style={imageItem} />
                    <p>Figure 25</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                  
                <div style={imageItem}>
                    <img src="/images/fig32.png" alt="Image 31" style={imageItem} />
                    <p>Figure 26</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>  
                <div style={imageItem}>
                    <img src="/images/fig33.png" alt="Image 32" style={imageItem} />
                    <p>Figure 27</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                 
                <div style={imageItem}>
                    <img src="/images/fig35.png" alt="Image 34" style={imageItem} />
                    <p>Figure 28</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                
                
                  
                 
                <div style={imageItem}>
                    <img src="/images/fig1.png" alt="Image 39" style={imageItem} />
                    <p>Figure 29</p>
                    <button style={buttonStyle}>Shop Now</button>
                </div>
                
            </section>
        </>
    );

};
export default Home;