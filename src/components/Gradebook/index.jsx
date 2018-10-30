import React from 'react';
import PropTypes from 'prop-types';
import emailPropType from 'email-prop-type';
import { SearchField, Table, Modal } from '@edx/paragon';


export default class Gradebook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      grades: this.mapUserEnteriesPercent(this.props.results).sort(this.sortAlphaDesc),
      headings: this.mapHeadings(this.props.results[0]),
      filterValue: '',
      modalContent: (<h1>Hello, World!</h1>),
      modalOpen: false,
      modalModel: [{}],
      updateVal: 0,
    };
  }

  sortAlphaDesc = (gradeRowA, gradeRowB) => {
    const a = gradeRowA.username.toUpperCase();
    const b = gradeRowB.username.toUpperCase();
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  sortAlphaAsc = (gradeRowA, gradeRowB) => {
    const a = gradeRowA.username.toUpperCase();
    const b = gradeRowB.username.toUpperCase();
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  };

  sortNumerically = (colKey, direction) => {
    function sortNumAsc(gradeRowA, gradeRowB) {
      if (gradeRowA[colKey] < gradeRowB[colKey]) {
        return -1;
      }
      if (gradeRowA[colKey] > gradeRowB[colKey]) {
        return 1;
      }
      return 0;
    }
  
    function sortNumDesc(gradeRowA, gradeRowB) {
      if (gradeRowA[colKey] < gradeRowB[colKey]) {
        return 1;
      }
      if (gradeRowA[colKey] > gradeRowB[colKey]) {
        return -1;
      }
      return 0;
    };

    this.setState({grades: [...this.state.grades].sort(direction === 'desc' ? sortNumDesc : sortNumAsc)});
  }

  mapHeadings = entry => {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: true,
      onSort: direction => {
        this.setState({
          grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc)
        })
      },
     }];
    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.is_graded && section.label)
      .map(s => ({
        label: s.label, 
        key: s.label,
        columnSortable: true,
        onSort: direction => {this.sortNumerically(s.label, direction)},
      }));
    const totals = [{
      label: 'Total', 
      key: 'total',
      columnSortable: true,
      onSort: direction => {this.sortNumerically('total', direction)},
    }];

    return results.concat(assignmentHeadings).concat(totals);
  };

  mapHeadingsHw = entry => {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: true,
      onSort: direction => {
        this.setState({
          grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc)
        })
      },
     }];
    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.is_graded && section.label && section.category == 'Homework' )
      .map(s => ({
        label: s.label, 
        key: s.label,
        columnSortable: true,
        onSort: direction => {this.sortNumerically(s.label, direction)},
      }));

    return results.concat(assignmentHeadings);
  };

  mapHeadingsExam = entry => {
    const results = [{
      label: 'Username',
      key: 'username',
      columnSortable: true,
      onSort: direction => {
        this.setState({
          grades: [...this.state.grades].sort(direction === 'desc' ? this.sortAlphaDesc : this.sortAlphaAsc)
        })
      },
     }];
    const assignmentHeadings = entry.section_breakdown
      .filter(section => section.is_graded && section.label && section.category == 'Exam' )
      .map(s => ({
        label: s.label, 
        key: s.label,
        columnSortable: true,
        onSort: direction => {this.sortNumerically(s.label, direction)},
      }));

    return results.concat(assignmentHeadings);
  };

  mapUserEnteriesPercent = (entries) => entries.map(entry => {
    const results = {username: entry.username};
    const assignments = entry.section_breakdown
      .filter(section => section.is_graded)
      .reduce((acc,s) => {
        acc[s.label]= (
          <button 
            className="btn btn-header link-style"
            onClick={()=> this.setState({
              modalModel: [{
                username: entry.username,
                autoGrade: `${s.score_earned}/${s.score_possible}`,
                adjustedGrade: (<span><input style={{width: '25px'}} type='text' value={this.updateVal}></input> / {s.score_possible}</span>),
                assignmentName: `${s.subsection_name}`,
              }],
              modalOpen: true,
            })}
          >
            {s.percent}
          </button>);
        return acc; 
    }, {});
    const totals = {total: entry.percent * 100}
    return Object.assign(results, assignments, totals);
  });

  mapUserEnteriesAbsolute = (entries) => entries.map(entry => {
    const results = {username: entry.username};
    const assignments = entry.section_breakdown
      .filter(section => section.is_graded)
      .reduce((acc,s) => {
        acc[s.label]= (
          <button 
            className="btn btn-header link-style"
            onClick={()=> this.setState({
              modalModel: [{
                username: entry.username,
                autoGrade: `${s.score_earned}/${s.score_possible}`,
                adjustedGrade: (<span><input style={{width: '25px'}} type='text' value={this.updateVal}></input> / {s.score_possible}</span>),
                assignmentName: `${s.subsection_name}`,
              }],
              modalOpen: true,
            })}
          >
            {s.score_earned}/{s.score_possible}
          </button>);
          //TODO: This is a really hacky thing I'm doing just to get sorting to work. Should be able to clean this up drastically when I introduce the reducers
          acc[`${s.label}Percent`] = s.percent

        return acc; 
    }, {});
    const totals = {total: entry.percent * 100}
    return Object.assign(results, assignments, totals);
  });

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="card" style={{width: '50rem'}}>
          <div className="card-body">
            <h1>Gradebook</h1>
            <hr/>
            <div className="d-flex justify-content-between" >
              <div>
                <div>
                  Score View: 
                  <span>
                    <input 
                      id='score-view-percent' 
                      className='ml-2' 
                      type='radio' 
                      name='score-view'
                      value='percent' 
                      onClick={()=> {this.setState({
                        grades: this.mapUserEnteriesPercent(this.props.results).sort(this.sortAlphaDesc),
                      })}}
                    />
                    <label className='ml-2 mr-2' htmlFor='score-view-percent'>Percent</label>
                  </span>
                  <span>
                    <input 
                      id='score-view-absolute'
                      type='radio' 
                      name='score-view' 
                      value='absolute' 
                      onClick={()=> {this.setState({
                        grades: this.mapUserEnteriesAbsolute(this.props.results).sort(this.sortAlphaDesc),
                      })}}
                    />
                    <label className='ml-2 mr-2' htmlFor='score-view-absolute'>Absolute</label>
                  </span>
                </div>
                <div>
                  Category: 
                  <span>
                    <input 
                      id='category-all' 
                      className='ml-2' 
                      type='radio' 
                      name='category'
                      value='all' 
                      onClick={()=> {this.setState({
                        headings: this.mapHeadings(this.props.results[0]),
                      })}}
                    />
                    <label className='ml-2 mr-2' htmlFor='category-all'>All</label>
                  </span>
                  <span>
                    <input 
                      id='category-homework' 
                      className='ml-2' 
                      type='radio' 
                      name='category'
                      value='homework' 
                      onClick={()=> {this.setState({
                        headings: this.mapHeadingsHw(this.props.results[0]),
                      })}}
                    />
                    <label className='ml-2 mr-2' htmlFor='category-homework'>Homework</label>
                  </span>
                  <span>
                    <input 
                      id='category-exam'
                      type='radio' 
                      name='category' 
                      value='exam' 
                      onClick={()=> {this.setState({
                        headings: this.mapHeadingsExam(this.props.results[0]),
                      })}}
                    />
                    <label className='ml-2 mr-2' htmlFor='Exam'>Exam</label>
                  </span>
                </div>
              </div>
              <div>
                <div style={{marginLeft: "10px" ,marginBottom: "10px"}}>
                  <a href="https://www.google./com">Download Grade Report</a>
                </div>
                <SearchField 
                  onSubmit={() => {this.setState({
                    grades: this.mapUserEnteriesPercent(this.props.results).filter(entry => entry.username == '' || entry.username.includes(this.state.filterValue))
                  })}}
                  onChange={filterValue => this.setState({filterValue})}
                  onClear={() => {this.setState({grades: this.mapUserEnteriesPercent(this.props.results).sort(this.sortAlphaDesc)})}}
                  value={this.state.filterValue}
                />
              </div>
            </div>
            <br/>
            <div className="gbook">
              <Table
                columns={this.state.headings}
                data={this.state.grades}
                tableSortable={true}
                defaultSortDirection='desc'
                defaultSortedColumn='username'
              />
            </div>

            <Modal
                open={this.state.modalOpen}
                title="Edit Grades"
                body={(
                  <div>
                    <h3>{this.state.modalModel[0].assignmentName}</h3>
                    <Table
                      columns={[{label: 'Username', key: 'username',},{label: 'Auto grade',key: 'autoGrade',},{label: 'Adjusted grade',key: 'adjustedGrade',}]}
                      data={this.state.modalModel}
                      tableSortable={true}
                      defaultSortDirection='desc'
                      defaultSortedColumn='username'
                    />
                  </div>
                )}
                onClose={()=> this.setState({modalOpen: false,})}
            />
          </div>
        </div>
      </div>
    );
  }
}

Gradebook.defaultProps = {
  "results": [
    {
      "course_id": "course-v1:edX+DemoX+Demo_Course",
      "email": "honor@example.com",
      "user_id": 6,
      "username": "honor",
      "full_name": "",
      "passed": false,
      "percent": 0,
      "letter_grade": null,
      "progress_page_url": "/courses/course-v1:edX+DemoX+Demo_Course/progress/6/",
      "section_breakdown": [
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Introduction",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b",
          "subsection_name": "Demo Course Overview"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/3.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 3,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Lesson 1 - Getting Started"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/11.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 01",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@basic_questions",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 11,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Homework - Question Styles"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Lesson 2 - Let's Get Interactive!"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/5.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 02",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@graded_simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 5,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Labs and Demos"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/19.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@175e76c4951144a29d46211361266e0e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 19,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Essays"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@48ecb924d7fe4b66a230137626bfa93e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Lesson 3 - Be Social"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@dbe8fc027bcb4fe9afb744d2e8415855",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Homework - Find Your Study Buddy"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@6ab9c442501d472c8ed200e367b4edfa",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "More Ways to Connect"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Exam",
          "chapter_name": "About Exams and Certificates",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/6.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@workflow",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 6,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@1414ffd5143b4b508f739b563ab468b7",
          "subsection_name": "edX Exams"
        }
      ],
      "aggregates": {
        "Exam": {
          "score_possible": 6,
          "score_earned": 0
        },
        "Homework": {
          "score_possible": 16,
          "score_earned": 0
        }
      }
    },
    {
      "course_id": "course-v1:edX+DemoX+Demo_Course",
      "email": "audit@example.com",
      "user_id": 7,
      "username": "audit",
      "full_name": "",
      "passed": false,
      "percent": 0.17,
      "letter_grade": null,
      "progress_page_url": "/courses/course-v1:edX+DemoX+Demo_Course/progress/7/",
      "section_breakdown": [
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Introduction",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b",
          "subsection_name": "Demo Course Overview"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/3.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 3,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Lesson 1 - Getting Started"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.45",
          "is_graded": true,
          "grade_description": "(5.00/11.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 01",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@basic_questions",
          "percent": 0.45,
          "score_earned": 5,
          "score_possible": 11,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Homework - Question Styles"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Lesson 2 - Let's Get Interactive!"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/5.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 02",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@graded_simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 5,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Labs and Demos"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/19.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@175e76c4951144a29d46211361266e0e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 19,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Essays"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@48ecb924d7fe4b66a230137626bfa93e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Lesson 3 - Be Social"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@dbe8fc027bcb4fe9afb744d2e8415855",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Homework - Find Your Study Buddy"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@6ab9c442501d472c8ed200e367b4edfa",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "More Ways to Connect"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Exam",
          "chapter_name": "About Exams and Certificates",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/6.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@workflow",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 6,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@1414ffd5143b4b508f739b563ab468b7",
          "subsection_name": "edX Exams"
        }
      ],
      "aggregates": {
        "Exam": {
          "score_possible": 6,
          "score_earned": 0
        },
        "Homework": {
          "score_possible": 16,
          "score_earned": 5
        }
      }
    },
    {
      "course_id": "course-v1:edX+DemoX+Demo_Course",
      "email": "verified@example.com",
      "user_id": 8,
      "username": "verified",
      "full_name": "",
      "passed": false,
      "percent": 0,
      "letter_grade": null,
      "progress_page_url": "/courses/course-v1:edX+DemoX+Demo_Course/progress/8/",
      "section_breakdown": [
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Introduction",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b",
          "subsection_name": "Demo Course Overview"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/3.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 3,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Lesson 1 - Getting Started"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/11.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 01",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@basic_questions",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 11,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Homework - Question Styles"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Lesson 2 - Let's Get Interactive!"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/5.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 02",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@graded_simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 5,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Labs and Demos"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/19.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@175e76c4951144a29d46211361266e0e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 19,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Essays"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@48ecb924d7fe4b66a230137626bfa93e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Lesson 3 - Be Social"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@dbe8fc027bcb4fe9afb744d2e8415855",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Homework - Find Your Study Buddy"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@6ab9c442501d472c8ed200e367b4edfa",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "More Ways to Connect"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Exam",
          "chapter_name": "About Exams and Certificates",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/6.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@workflow",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 6,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@1414ffd5143b4b508f739b563ab468b7",
          "subsection_name": "edX Exams"
        }
      ],
      "aggregates": {
        "Exam": {
          "score_possible": 6,
          "score_earned": 0
        },
        "Homework": {
          "score_possible": 16,
          "score_earned": 0
        }
      }
    },
    {
      "course_id": "course-v1:edX+DemoX+Demo_Course",
      "email": "staff@example.com",
      "user_id": 9,
      "username": "staff",
      "full_name": "",
      "passed": false,
      "percent": 0,
      "letter_grade": null,
      "progress_page_url": "/courses/course-v1:edX+DemoX+Demo_Course/progress/9/",
      "section_breakdown": [
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Introduction",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@edx_introduction",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@d8a6192ade314473a78242dfeedfbf5b",
          "subsection_name": "Demo Course Overview"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/3.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 3,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Lesson 1 - Getting Started"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 1: Getting Started",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/11.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 01",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@basic_questions",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 11,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@interactive_demonstrations",
          "subsection_name": "Homework - Question Styles"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Lesson 2 - Let's Get Interactive!"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Homework",
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/5.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": "Ex 02",
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@graded_simulations",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 5,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Labs and Demos"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 2: Get Interactive",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/19.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@175e76c4951144a29d46211361266e0e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 19,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@graded_interactions",
          "subsection_name": "Homework - Essays"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@48ecb924d7fe4b66a230137626bfa93e",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Lesson 3 - Be Social"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@dbe8fc027bcb4fe9afb744d2e8415855",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "Homework - Find Your Study Buddy"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "Example Week 3: Be Social",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@6ab9c442501d472c8ed200e367b4edfa",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@social_integration",
          "subsection_name": "More Ways to Connect"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": "Exam",
          "chapter_name": "About Exams and Certificates",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": true,
          "grade_description": "(0.00/6.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@workflow",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 6,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@1414ffd5143b4b508f739b563ab468b7",
          "subsection_name": "edX Exams"
        },
        {
          "are_grades_published": true,
          "auto_grade": false,
          "category": null,
          "chapter_name": "holding section",
          "comment": "",
          "detail": "",
          "displayed_value": "0.00",
          "is_graded": false,
          "grade_description": "(0.00/0.00)",
          "is_ag": false,
          "is_average": false,
          "is_manually_graded": false,
          "label": null,
          "letter_grade": null,
          "module_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@07bc32474380492cb34f76e5f9d9a135",
          "percent": 0,
          "score_earned": 0,
          "score_possible": 0,
          "section_block_id": "block-v1:edX+DemoX+Demo_Course+type@chapter+block@9fca584977d04885bc911ea76a9ef29e",
          "subsection_name": "New Subsection"
        }
      ],
      "aggregates": {
        "Exam": {
          "score_possible": 6,
          "score_earned": 0
        },
        "Homework": {
          "score_possible": 16,
          "score_earned": 0
        }
      }
    }
  ]
};


// CommentDetails.defaultProps = {
//   id: null,
//   postId: null,
//   name: '',
//   email: 'example@example.com',
//   body: '',
// };

// CommentDetails.propTypes = {
//   id: PropTypes.number,
//   postId: PropTypes.number,
//   name: PropTypes.string,
//   email: emailPropType,
//   body: PropTypes.string,
// };

