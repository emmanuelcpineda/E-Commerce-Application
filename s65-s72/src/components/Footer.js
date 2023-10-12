import Container from 'react-bootstrap/Container';
import '../styles/components/Footer.css'

function Footer() {
  return (
    <footer className=" footer py-3">
      <Container>
        <p className="text-center mb-0">© ECP {new Date().getFullYear()} | Sneakicks Shoes Store | Disclaimer: Photos Used Are For Educational Purposes Only. All Rights Reserved</p>
      </Container>
    </footer>
  );
} 

export default Footer;
