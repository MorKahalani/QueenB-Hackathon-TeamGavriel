import styles from './StatCard.module.css';
import PropTypes from 'prop-types';

const StatCard = ({label,count,type}) => {

    const getLabelClass = () => {
        if(type === 'urgent') return styles.urgentLabel;
        if(type === 'new') return styles.newLabel;
        return styles.processLabel; 
    };
    return(
        <div className= {styles.StatCard}>
            <p className= {getLabelClass()}>{label}</p>
            <span>{count}</span>
        </div>
    );
};

    StatCard.propTypes = {
    label: PropTypes.string.isRequired, 
    count: PropTypes.number.isRequired, 
    type: PropTypes.string     

};

export default StatCard;