export interface StoryScene {
  id: number;
  titleUrdu: string;
  titleRoman: string;
  titleEnglish: string;
  urduParagraphs: string[];
  romanParagraphs: string[];
  englishParagraphs: string[];
  highlightQuoteUrdu: string;
  highlightQuoteRoman: string;
  highlightQuoteEnglish: string;
  imageSrc: string;
  cameraInfo: string;
  themeColor: string;
}

export interface StoryEpisode {
  episodeNumber: number;
  titleUrdu: string;
  titleRoman: string;
  titleEnglish: string;
  descriptionUrdu: string;
  nextEpisodeTeaserUrdu: string;
  nextEpisodeTeaserRoman: string;
  nextEpisodeTeaserEnglish: string;
  scenes: StoryScene[];
}

export type ViewMode = 'cinematic' | 'reader' | 'quotes';
export type LanguageMode = 'urdu' | 'roman' | 'english' | 'both';
