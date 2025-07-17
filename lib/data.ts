import { Company } from '@/lib/validations';

// In-memory storage (in production, this would be a database)
export let companies: Company[] = [];

// Initialize with sample data
export const initializeData = () => {
  if (companies.length === 0) {
    companies = [
      {
        id: 'legaltech-innovations',
        name: 'LegalTech Innovations',
        shareholders: [
          { id: 'luca-fabian', name: 'Luca Fábián', shares: 3500 },
          { id: 'david-roegiers', name: 'David Roegiers', shares: 3200 },
          { id: 'sercan-izgi', name: 'Sercan Izgi', shares: 1800 },
          { id: 'selim-gautschi', name: 'Selim Gautschi', shares: 1200 },
          { id: 'jurata-capital-partners-1', name: 'Jurata Capital Partners', shares: 2300 }
        ]
      },
      {
        id: 'swiss-ai-solutions',
        name: 'Swiss AI Solutions',
        shareholders: [
          { id: 'mihai-chiciu', name: 'Mihai Chiciu', shares: 2200 },
          { id: 'joel-wohlhauser', name: 'Joel Wohlhauser', shares: 2000 },
          { id: 'jakub-zak', name: 'Jakub Zak', shares: 1800 },
          { id: 'pauline-meyer', name: 'Pauline Meyer', shares: 1500 },
          { id: 'luca-buchi', name: 'Luca Büchi', shares: 1200 },
          { id: 'venture-capital-zurich', name: 'Venture Capital Zurich', shares: 2800 }
        ]
      },
      {
        id: 'digital-operations-hub',
        name: 'Digital Operations Hub',
        shareholders: [
          { id: 'tristan-schloesser', name: 'Tristan Schloesser', shares: 1600 },
          { id: 'moesha-hagmann', name: 'Moesha Hagmann', shares: 1400 },
          { id: 'tatjana-russo', name: 'Tatjana Russo', shares: 1200 },
          { id: 'francoise-birnholz', name: 'Françoise Birnholz', shares: 2000 },
          { id: 'manuel-hauslaib', name: 'Manuel Hauslaib', shares: 1800 },
          { id: 'swiss-innovation-fund', name: 'Swiss Innovation Fund', shares: 2400 }
        ]
      },
      {
        id: 'advisory-ventures',
        name: 'Advisory Ventures',
        shareholders: [
          { id: 'florian-faes', name: 'Florian Faes', shares: 1500 },
          { id: 'sandor-horvath', name: 'Sandor Horvath', shares: 1400 },
          { id: 'simon-raess', name: 'Simon Raess', shares: 1300 },
          { id: 'milena-reutlinger', name: 'Milena Reutlinger', shares: 1200 },
          { id: 'ralf-schlaepfer', name: 'Ralf Schlaepfer', shares: 1100 },
          { id: 'andrin-spring', name: 'Andrin Spring', shares: 1000 },
          { id: 'jurata-capital-partners-2', name: 'Jurata Capital Partners', shares: 3500 }
        ]
      }
    ];
  }
}; 