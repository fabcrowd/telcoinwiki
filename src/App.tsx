import Header from './components/Header';
import Footer from './components/Footer';
import DeepDivePathways from './components/DeepDivePathways';
import StarfieldBackground from './components/StarfieldBackground';
import StatusLanding from './pages/StatusLanding';

const App = () => {
  return (
    <div className="relative min-h-screen bg-background text-white">
      <StarfieldBackground />
      <Header />
      <StatusLanding />
      <DeepDivePathways />
      <Footer />
    </div>
  );
};

export default App;
