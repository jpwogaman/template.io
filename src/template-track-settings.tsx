import { DropdownButton, Dropdown, Row, Col, Form, Container, Button, ButtonGroup, ButtonToolbar, Table } from 'react-bootstrap';
import { numListAll } from './template-arrays';
import { IconBtnToggle } from './template-icon-button-toggle'
import { SettingsRow } from './template-settings-row'

export default function TemplateTrackSettings() {

    const closeSettingsWindow = () => {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MSshow', 'MShide');
        document.getElementById('TemplateTracks')!.classList.replace('MSshowTemplateTracks', 'MShideTemplateTracks');
    }

    return (
        <Container id="TemplateTrackSettings" className="MShide">
            <ButtonToolbar>
                <ButtonGroup className="container">
                    <Button
                        variant="primary"
                        size="sm"
                        title="Close Track Settings Window"
                        onClick={closeSettingsWindow}>
                        <i className="fa-solid fa-xmark"></i>
                    </Button>
                    <IconBtnToggle
                        variant="primary"
                        size="sm"
                        title="Close Track Settings Window"
                        id="editLock"
                        a="fa-solid fa-lock-open"
                        b="fa-solid fa-lock"
                        defaultIcon="a">
                    </IconBtnToggle>
                    <DropdownButton id="dropdown-item-button" title="Save Track Settings">
                        <Dropdown.Item as="button">Print Track Settings</Dropdown.Item>
                        <Dropdown.Item as="button">Save Track Settings as Manufacturer Default</Dropdown.Item>
                        <Dropdown.Item as="button">Open Manufacturer Default Settings for Track</Dropdown.Item>
                        <Dropdown.Item as="button">Save Track Settings as User Default</Dropdown.Item>
                        <Dropdown.Item as="button">Open User Default Settings for Track</Dropdown.Item>
                    </DropdownButton>
                </ButtonGroup>
            </ButtonToolbar >

            <h2 id="trkEditDisplay">Track:</h2>

            <Row sm="auto">
                <Col>
                    <h3>Playable Range:</h3>
                </Col>
                <Col>
                    <Form.Select>
                        {numListAll}
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select>
                        {numListAll}
                    </Form.Select>
                </Col>
            </Row>

            <h3>Faders</h3>

            <Table hover responsive className='table-condensed'>
                <thead>
                    <tr>
                        <th data-width="3%">No.</th>
                        <th data-width="30%">Type</th>
                        <th data-width="18%">Code</th>
                        <th data-width="18%">Default</th>
                        <th data-width="31%">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="01" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="02" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="03" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="04" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="05" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="06" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="07" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="08" type="fad" variant={undefined}></SettingsRow>
                </tbody>
            </Table>

            <h3>Articulations (toggle)</h3>

            <Table hover responsive>
                <thead>
                    <tr>
                        <th data-width="3%">No.</th>
                        <th data-width="30%">Type</th>
                        <th data-width="9%">Code</th>
                        <th data-width="9%">On</th>
                        <th data-width="9%">Off</th>
                        <th data-width="9%">Default</th>
                        <th data-width="31%">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="01" type="art" variant="tog"></SettingsRow>
                    <SettingsRow id="02" type="art" variant="tog"></SettingsRow>
                </tbody>
            </Table>
            <h3>Articulations (one-at-a-time)</h3>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th data-width="3%">No.</th>
                        <th data-width="30%">Type</th>
                        <th data-width="9%">Code</th>
                        <th data-width="9%">On</th>
                        <th data-width="9%">Range</th>
                        <th data-width="9%">Default</th>
                        <th data-width="31%">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="03" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="04" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="05" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="06" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="07" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="08" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="09" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="10" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="11" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="12" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="13" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="14" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="15" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="16" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="17" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="18" type="art" variant={undefined}></SettingsRow>
                </tbody>
            </Table>
        </Container >
    );
};