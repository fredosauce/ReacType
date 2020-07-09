import createApplicationUtil from './createApplication.util';
import createNextApp from './createNextApp.util';
import createFiles from './createFiles.util';


const exportProject = (
  path: string,
  appName: string,
  genOption: number,
  components: any,
  rootComponents: number[]
) => {
  if (genOption === 1) {
    console.log('in exportProject, genOption 1')
    createApplicationUtil({ path, appName, components })
      .then(() => {
        console.log('CreateApplicationUtil has finished');
      })
      .catch(err => console.log(err));
  } else if (genOption === 0) {
    console.log('in exportProject, genOption 0')
    createFiles(components, path, appName, false);
  } else if (genOption === 2) {
    console.log('in exportProject, genOption 2')
    createNextApp({ path, appName, components, rootComponents})
    .then(() => {
      console.log('CreateNextApp has finished');
    })
    .catch(err => console.log(err));
  }
};

export default exportProject;