# Indian Name Cleanup Service

A comprehensive web application for processing Indian names from CSV files. This service extracts honorifics, corrects spelling mistakes, and provides confidence scores for name corrections using advanced similarity algorithms.

## Features

- **Honorific Extraction**: Automatically detects and extracts common Indian honorifics (Mr., Mrs., Ms., Dr., Prof., Sri/Shri, Smt., etc.)
- **Spell Checking**: Uses multiple similarity algorithms (Levenshtein distance, Jaro-Winkler, phonetic matching) to correct misspelled names
- **Comprehensive Dictionary**: Includes 200+ Indian first names and 100+ surnames covering various regions
- **Confidence Scoring**: Provides high/medium/low confidence ratings for all corrections
- **CSV Processing**: Handles file upload, processing, and download of cleaned data
- **Real-time Preview**: Shows processing results with highlighted corrections
- **Statistics Dashboard**: Displays comprehensive processing statistics

## Input Format

The application expects a CSV file with the following columns:
- `First Name`
- `Last Name` 
- `Gender`
- `Email`
- `Date of Birth`

## Output Format

The processed CSV includes all original columns plus:
- `Honorific` - Extracted honorifics
- `Original First Name` - Original first name input
- `Original Last Name` - Original last name input
- `Corrected First Name` - Spell-corrected first name
- `Corrected Last Name` - Spell-corrected last name
- `First Name Corrected` - Yes/No indicator
- `Last Name Corrected` - Yes/No indicator
- `First Name Similarity` - Similarity percentage
- `Last Name Similarity` - Similarity percentage
- `Confidence` - Overall confidence level

## Technology Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **Icons**: Lucide React
- **Deployment**: Vercel (optimized for Next.js)

## Local Development

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd name-cleanup-service
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Using Vercel CLI:**
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

2. **Using GitHub Integration:**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically deploy on every push

3. **Manual Deployment:**
   - Visit [vercel.com](https://vercel.com)
   - Import your project
   - Deploy with default settings

### Deploy to Other Platforms

#### Netlify
\`\`\`bash
npm run build
# Upload the .next folder to Netlify
\`\`\`

#### Railway
\`\`\`bash
# Add railway.json configuration
npm run build
railway deploy
\`\`\`

#### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Environment Variables

No environment variables are required for basic functionality. The application runs entirely client-side for CSV processing.

### Build Configuration

The project includes optimized build settings:

- **next.config.js**: Configured for static export compatibility
- **TypeScript**: Configured with strict mode disabled for deployment
- **ESLint**: Build errors ignored for deployment
- **Images**: Unoptimized for static hosting compatibility

## Usage

1. **Upload CSV File**: Select a CSV file with the required columns
2. **Process Names**: Click "Process Names" to start the analysis
3. **Review Results**: Check the statistics and preview table
4. **Download Results**: Download the cleaned CSV file

## Algorithm Details

### Similarity Metrics

The application uses multiple algorithms for accurate name matching:

1. **Levenshtein Distance**: Character-level edit distance
2. **Jaro Similarity**: Handles character transpositions
3. **Jaro-Winkler**: Gives extra weight to common prefixes
4. **Phonetic Similarity**: Handles Indian pronunciation variations

### Confidence Scoring

- **High Confidence (85%+ similarity)**: Very likely correct
- **Medium Confidence (75-84% similarity)**: Probably correct
- **Low Confidence (65-74% similarity)**: Requires manual review

### Name Dictionary

The dictionary includes:
- 200+ Indian first names (male, female, unisex)
- 100+ Indian surnames from various regions
- Regional variations and common spellings
- South Indian, North Indian, Bengali, and other regional names

## File Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── lib/
│   ├── indian-names-dictionary.ts  # Name dictionary and algorithms
│   ├── name-processing-service.ts  # Core processing logic
│   └── csv-utils.ts        # CSV parsing utilities
├── components/ui/          # shadcn/ui components (auto-imported)
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Performance Considerations

- **Large Files**: The application processes files client-side, so very large CSV files (>10MB) may cause performance issues
- **Memory Usage**: Processing is done in memory, so browser memory limits apply
- **Batch Processing**: For very large datasets, consider splitting into smaller files

## Troubleshooting

### Common Issues

1. **CSV Upload Fails**: Ensure your CSV has the exact column names required
2. **Processing Hangs**: Large files may take time; check browser console for errors
3. **Download Fails**: Ensure your browser allows file downloads

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with detailed information

## Roadmap

- [ ] Add support for more regional Indian names
- [ ] Implement batch processing for large files
- [ ] Add manual review interface for low-confidence corrections
- [ ] Integration with external name validation APIs
- [ ] Support for additional file formats (Excel, JSON)
- [ ] Advanced phonetic matching algorithms
