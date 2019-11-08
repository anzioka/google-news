import { MdFlag, MdBusiness,MdHealing,MdLocalMovies } from 'react-icons/md';
import { FaRunning, FaMemory, FaFlask } from 'react-icons/fa';

const newsCategories = [
  {icon: MdFlag, label: "General", value: 'general'},
  {icon: MdBusiness, label: "Business", value: 'business'},
  {icon: MdLocalMovies, label: "Entertainment", value: "entertainment"},
  {icon: FaFlask, label: "Science", value: "science"},
  {icon: FaRunning, label: "Sports", value: 'sports'},
  {icon: MdHealing, label: "Health", value: 'health'},
  {icon: FaMemory, label: "Technology", value: 'technology'},
];
export default newsCategories;
