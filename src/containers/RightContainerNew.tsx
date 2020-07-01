import React, { useState, useContext, useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { stateContext } from '../context/context';
import HTMLTypes from '../context/HTMLTypes';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  select: {
    fontSize: '1.25em',
    '> .MuiSelect-icon': {
      color: 'white'
    }
  },
  selectInput: {
    color: '#fff',
    paddingTop: '15px',
    paddingLeft: '15px'
  },
  formControl: {
    minWidth: '125px',
    backgroundColor: 'rgba(255,255,255,0.15)'
  },
  configRow: {
    display: 'flex',
    paddingLeft: '25px',
    paddingRight: '25px',
    marginTop: '20px',
  },
  configType: {
    color: '#fff',
    minWidth: '185px',
    fontSize: '1em'
  },
  configValue: {
    marginLeft: '20px'
  },
  buttonRow: {
    textAlign: 'center',
    marginTop: '25px', 
    '& > .MuiButton-textSecondary' : {
      color: 'rgba(255,0,0,0.75)'
    }
  },
  button: {
    fontSize: '1rem',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  compName: {
    color: '#01d46d',
    fontSize: '1.25rem'
  },
  configHeader: {
    height: '70px',
    '& > h4': {
      fontSize: '1.15rem',
      letterSpacing: '0.5px',
      marginBottom: '0',
      marginTop: '10px'
    }
  }
});


const RightContainer = ():JSX.Element  => {
  const classes = useStyles();
  const [state, dispatch] = useContext(stateContext);

  const [displayMode, setDisplayMode] = useState('');
  const [flexDir, setFlexDir] = useState('');
  const [flexJustify, setFlexJustify] = useState('');
  const [flexAlign, setFlexAlign] = useState('');
  const [BGColor, setBGColor] = useState('');

  const [compWidth, setCompWidth] = useState('');
  const [compHeight, setCompHeight] = useState('');

  const resetFields = () => {
    setDisplayMode('');
    setFlexDir('');
    setFlexJustify('');
    setFlexAlign('');
    setCompWidth('');
    setCompHeight('');
    setBGColor('');
  }

  //reset input fields if focus changes
  useEffect(()=> {
    // reset
    console.log('canvas focus changed');
    resetFields();
  }, [state.canvasFocus.componentId, state.canvasFocus.childId]);


  // handles all input field changes, with specific updates called based on input's name
  const handleChange = (e: React.ChangeEvent<{value: any}>) => {
    let inputVal = e.target.value;
    switch(e.target.name) {
      case 'display':
        setDisplayMode(inputVal);
        break;
      case 'flexdir':
        setFlexDir(inputVal);
        break;
      case 'flexjust':
        setFlexJustify(inputVal);
        break;
      case 'flexalign':
        setFlexAlign(inputVal);
        break;
      case 'width':
        setCompWidth(inputVal);
        break;
      case 'height':
        setCompHeight(inputVal);
        break;
      case 'bgcolor':
        setBGColor(inputVal);
        break;
    }
  }

  // returns the current component referenced in canvasFocus 
  // along with its child instance, if it exists
  const getFocus = () => {
    // find and store component's name based on canvasFocus.componentId
    // note: deep clone here to make sure we don't end up altering state
    let focusTarget = JSON.parse(JSON.stringify(state.components.find(comp => comp.id === state.canvasFocus.componentId )));
    delete focusTarget.child;
    
    // checks if canvasFocus references a childId
    const childInstanceId = state.canvasFocus.childId ? state.canvasFocus.childId : null;

    // if so, breadth-first search through focusTarget's descendants to find matching child
    if (childInstanceId) {
      focusTarget.child = {};
      focusTarget.child.id = childInstanceId;
      let focusChild = {}; //child instance being referenced in canvasFocus
      const searchArray = [...focusTarget.children];
      while (searchArray.length > 0) {
        const currentChild = searchArray.shift();
        if (currentChild.childId === childInstanceId) focusChild = currentChild;
        currentChild.children.forEach(child => searchArray.push(child));
      }
      // if type is Component, use child's typeId to search through state components and find matching component's name
      if (focusChild.type === 'Component') {
        focusTarget.child.type = 'component';
        focusTarget.child.name = state.components.find(comp => comp.id === focusChild.typeId).name;
      // if type is HTML Element, search through HTML types to find matching element's name
      } else if (focusChild.type === 'HTML Element') {
        focusTarget.child.type = 'HTML element';
        focusTarget.child.name = HTMLTypes.find(elem => elem.id === focusChild.typeId).name;
      }
    }
    console.log('right panel focus: ');
    console.log(focusTarget);
    
    return focusTarget;
  }

  // dispatch to 'UPDATE CSS' called when save button is clicked,
  // passing in style object constructed from all changed input values
  const handleSave = ():Object => {
    const styleObj = {};
    if (displayMode !== '') styleObj.display = displayMode;
    if (flexDir !== '') styleObj.flexDirection = flexDir;
    if (flexJustify !== '') styleObj.justifyContent = flexJustify;
    if (flexAlign !== '') styleObj.alignItems = flexAlign;
    if (compWidth !== '') styleObj.width = compWidth;
    if (compHeight !== '') styleObj.height = compHeight;
    if (BGColor !== '') styleObj.backgroundColor = BGColor;
    console.log(styleObj);
    dispatch({
      type: 'UPDATE CSS',
      payload: { style: styleObj }
    });
    resetFields();
    return styleObj;
  }

  // placeholder for handling deleting instance
  const handleDelete = () => {
    console.log('DELETING ...');
  }

  const configTarget = getFocus();

  return (
    <div className="column right">
      <div className={classes.configHeader}>
        <h4>Configuration options in <span className={classes.compName}>{configTarget.name}</span></h4>
        { configTarget.child &&
          <h4>for instance <span className={classes.compName}>{configTarget.child.id}</span> of {configTarget.child.type} <span className={classes.compName}>{configTarget.child.name}</span ></h4>
        }
      </div>
      <div className={classes.configRow}>
        <div className={classes.configType}>
          <h3>Display:</h3>
        </div>
        <div className={classes.configValue}>
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              value={displayMode}
              name="display"
              onChange={handleChange}
              displayEmpty
              className={classes.select}
              inputProps={{ className: classes.selectInput }}
            >
              <MenuItem value=''></MenuItem>
              <MenuItem value={'block'}>block</MenuItem>
              <MenuItem value={'inline-block'}>inline-block</MenuItem>
              <MenuItem value={'flex'}>flex</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {/* flex options are hidden until display flex is chosen */}
      { displayMode === 'flex' && (
      <div>
        <div className={classes.configRow}>
          <div className={classes.configType}>
            <h3>Flex direction:</h3>
          </div>
          <div className={classes.configValue}>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                value={flexDir}
                name="flexdir"
                onChange={handleChange}
                displayEmpty
                className={classes.select}
                inputProps={{ className: classes.selectInput }}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value={'row'}>row</MenuItem>
                <MenuItem value={'column'}>column</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.configRow}>
          <div className={classes.configType}>
            <h3>Justify content:</h3>
          </div>
          <div className={classes.configValue}>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                value={flexJustify}
                name="flexjust"
                onChange={handleChange}
                displayEmpty
                className={classes.select}
                inputProps={{ className: classes.selectInput }}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value={'flex-start'}>flex-start</MenuItem>
                <MenuItem value={'flex-end'}>flex-end</MenuItem>
                <MenuItem value={'center'}>center</MenuItem>
                <MenuItem value={'space-between'}>space-between</MenuItem>
                <MenuItem value={'space-around'}>space-around</MenuItem>
                <MenuItem value={'space-evenly'}>space-evenly</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.configRow}>
          <div className={classes.configType}>
            <h3>Align items:</h3>
          </div>
          <div className={classes.configValue}>
            <FormControl variant="filled" className={classes.formControl}>
              <Select
                value={flexAlign}
                onChange={handleChange}
                name="flexalign"
                displayEmpty
                className={classes.select}
                inputProps={{ className: classes.selectInput }}
              >
                <MenuItem value=''></MenuItem>
                <MenuItem value={'stretch'}>stretch</MenuItem>
                <MenuItem value={'flex-start'}>flex-start</MenuItem>
                <MenuItem value={'flex-end'}>flex-end</MenuItem>
                <MenuItem value={'center'}>center</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      )}
      <div className={classes.configRow}>
        <div className={classes.configType}>
          <h3>Width:</h3>
        </div>
        <div className={classes.configValue}>
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              value={compWidth}
              name="width"
              onChange={handleChange}
              displayEmpty
              className={classes.select}
              inputProps={{ className: classes.selectInput }}
            >
              <MenuItem value=''></MenuItem>
              <MenuItem value={'auto'}>auto</MenuItem>
              <MenuItem value={'50%'}>50%</MenuItem>
              <MenuItem value={'25%'}>25%</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={classes.configRow}>
        <div className={classes.configType}>
          <h3>Height:</h3>
        </div>
        <div className={classes.configValue}>
          <FormControl variant="filled" className={classes.formControl}>
            <Select
              value={compHeight}
              name="height"
              onChange={handleChange}
              displayEmpty
              className={classes.select}
              inputProps={{ className: classes.selectInput }}
            >
              <MenuItem value=''></MenuItem>
              <MenuItem value={'auto'}>auto</MenuItem>
              <MenuItem value={'100%'}>100%</MenuItem>
              <MenuItem value={'50%'}>50%</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={classes.configRow}>
        <div className={classes.configType}>
          <h3>Background color:</h3>
        </div>
        <div className={classes.configValue}>
          <FormControl variant="filled" className={classes.formControl}>
            <TextField 
              variant="filled"
              name="bgcolor"
              className={classes.select}
              inputProps={{className: classes.selectInput}}
              value={BGColor}
              onChange={handleChange}
            />
          </FormControl>
        </div>
      </div>
      <div className={classes.buttonRow}>
        <Button color="primary" className={classes.button} onClick={handleSave}>
          SAVE
        </Button>
      </div>
      <div className={classes.buttonRow}>
        <Button color="secondary" className={classes.button} onClick={handleDelete}>
          DELETE INSTANCE
        </Button>
      </div>
    </div>
  )
}

export default RightContainer;