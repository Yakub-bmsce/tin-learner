// Hardcoded domain content - no API calls needed
export const getDomainContent = (domainId: string) => {
  const content: any = {
    'ai': {
      concepts: [
        { title: 'Machine Learning Basics', description: 'Understanding supervised, unsupervised, and reinforcement learning' },
        { title: 'Neural Networks', description: 'Deep dive into artificial neural networks' },
        { title: 'NLP', description: 'Natural Language Processing fundamentals' },
        { title: 'Computer Vision', description: 'Image recognition and processing' },
        { title: 'AI Ethics', description: 'Responsible AI development' },
      ],
      quiz: [
        { question: 'What is Machine Learning?', options: ['Hardware', 'AI subset that learns from data', 'Programming language', 'Database'], correct: 1 },
        { question: 'What is a Neural Network?', options: ['Computer network', 'Model inspired by brain', 'Database', 'OS'], correct: 1 },
        { question: 'What does NLP stand for?', options: ['New Learning', 'Natural Language Processing', 'Network Protocol', 'Neural Pattern'], correct: 1 },
        { question: 'What is overfitting?', options: ['Model too good on training data', 'Model too simple', 'Too few parameters', 'Trains too fast'], correct: 0 },
        { question: 'What is CNN used for?', options: ['Text', 'Images', 'Audio', 'Database'], correct: 1 },
        { question: 'What is gradient descent?', options: ['Neural network', 'Optimization algorithm', 'Language', 'Data structure'], correct: 1 },
        { question: 'What is transfer learning?', options: ['Moving data', 'Using pre-trained models', 'Transferring code', 'Sharing datasets'], correct: 1 },
        { question: 'What is a hyperparameter?', options: ['Large parameter', 'Set before training', 'Learned during training', 'Neural network type'], correct: 1 },
        { question: 'Purpose of activation functions?', options: ['Activate computer', 'Introduce non-linearity', 'Save memory', 'Speed up'], correct: 1 },
        { question: 'What is deep learning?', options: ['Learning deeply', 'Multi-layer neural networks', 'Database learning', 'Fast learning'], correct: 1 },
      ],
      exercises: [
        { title: 'Linear Regression Model', difficulty: 'Easy', description: 'Predict house prices' },
        { title: 'CNN Image Classifier', difficulty: 'Medium', description: 'Classify MNIST digits' },
        { title: 'Sentiment Analysis', difficulty: 'Hard', description: 'Analyze movie reviews' },
      ],
      projects: [
        { title: 'AI Chatbot', description: 'Build NLP-powered chatbot', duration: '2 weeks' },
        { title: 'Image Recognition App', description: 'Real-time object detection', duration: '3 weeks' },
      ],
    },
    'web-dev': {
      concepts: [
        { title: 'HTML & CSS', description: 'Web page structure and styling' },
        { title: 'JavaScript', description: 'Programming interactivity' },
        { title: 'React', description: 'Component-based UI development' },
        { title: 'Backend', description: 'Server-side with Node.js' },
        { title: 'Security', description: 'Web application security' },
      ],
      quiz: [
        { question: 'What is HTML?', options: ['Hyper Text Markup Language', 'High Tech Language', 'Home Tool Language', 'Hyperlinks Language'], correct: 0 },
        { question: 'CSS property?', options: ['color', 'font-size', 'padding', 'onclick'], correct: 3 },
        { question: 'What is DOM?', options: ['Document Object Model', 'Data Management', 'Digital Method', 'Document Mode'], correct: 0 },
        { question: 'What is React?', options: ['Database', 'JavaScript UI library', 'CSS framework', 'Backend framework'], correct: 1 },
        { question: 'What is REST API?', options: ['Sleep function', 'Web service architecture', 'Database', 'Language'], correct: 1 },
        { question: 'What is Node.js?', options: ['JavaScript runtime', 'Database', 'CSS framework', 'Editor'], correct: 0 },
        { question: 'Responsive design?', options: ['Fast loading', 'Adapts to screens', 'Animations', 'Forms'], correct: 1 },
        { question: 'What is AJAX?', options: ['Cleaning product', 'Asynchronous JS and XML', 'Language', 'Database'], correct: 1 },
        { question: 'What is Git?', options: ['Language', 'Version control', 'Database', 'Server'], correct: 1 },
        { question: 'What is npm?', options: ['Node Package Manager', 'Programming Method', 'Protocol Manager', 'Process Monitor'], correct: 0 },
      ],
      exercises: [
        { title: 'Portfolio Website', difficulty: 'Easy', description: 'Build personal portfolio' },
        { title: 'Todo App with React', difficulty: 'Medium', description: 'Full CRUD application' },
        { title: 'E-commerce Site', difficulty: 'Hard', description: 'Complete online store' },
      ],
      projects: [
        { title: 'Social Media Clone', description: 'Build Twitter-like app', duration: '3 weeks' },
        { title: 'Real-time Chat App', description: 'WebSocket-based chat', duration: '2 weeks' },
      ],
    },
  };

  // Return same structure for all domains
  return content[domainId] || content['ai'];
};
