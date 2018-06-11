import * as React from 'react';
import { WithStyles, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { StyleRules } from 'material-ui/styles/withStyles';
import RegularCard from '../components/Cards/RegularCard';
import { container } from '../variables/styles';

type ResourcePageStyleKeys = 'container';

type ResourcePageStyle = WithStyles<ResourcePageStyleKeys>;

const styles = () => ({
  container: {
    paddingTop: 40,
    ...container
  }
}) as StyleRules<ResourcePageStyleKeys>;

const githubUrl = 'https://github.com/linzeqipku/intellide-graph';

const bibtex1 = `
@article{lin2017intelligent,
  title={Intelligent Development Environment and Software Knowledge Graph},
  author={Lin, Ze-Qi and Xie, Bing and Zou, Yan-Zhen and Zhao, Jun-Feng and Li, Xuan-Dong and Wei, Jun and Sun,\
 Hai-Long and Yin, Gang},
  journal={Journal of Computer Science and Technology},
  volume={32},
  number={2},
  pages={242--249},
  year={2017},
  publisher={Springer}
}
`;

const bibtex2 = `
@inproceedings{lin2017improving,
  title={Improving software text retrieval using conceptual knowledge in source code},
  author={Lin, Zeqi and Zou, Yanzhen and Zhao, Junfeng and Xie, Bing},
  booktitle={Proceedings of the 32nd IEEE/ACM International Conference on Automated Software Engineering},
  pages={123--134},
  year={2017},
  organization={IEEE Press}
}
`;

class ResourcePage extends React.Component<ResourcePageStyle, {}> {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <RegularCard cardTitle="Code" headerColor="red">
          <a href={githubUrl}> {githubUrl} </a>
          <Typography type="body1">
            These programs and documents are distributed without any warranty, express or implied. As the programs were
            written for research purposes only, they have not been tested to the degree that would be advisable in any
            important application. All use of these programs is entirely at the user's own risk.
          </Typography>
        </RegularCard>

        <RegularCard cardTitle="Documentation" headerColor="green">
          <Typography type="body1">
            will be uploaded in near future.
          </Typography>
        </RegularCard>

        <RegularCard cardTitle="Papers" headerColor="orange">
          <Typography type="body1">
            If you use the program in your work, please cite:
          </Typography>
          <pre style={{wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}>{bibtex1}</pre>
          <pre style={{wordWrap: 'break-word', whiteSpace: 'pre-wrap'}}>{bibtex2}</pre>
        </RegularCard>
      </div>
    );
  }
}

export default withStyles(styles)<{}>(ResourcePage);