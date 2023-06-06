import { FC, useEffect, useState } from 'react';
import { Button } from '../../../components/button';
import { Plus } from '../../../assets/svg/SVGcomponent';
import { CompanyCard } from '../../../components/companyCard/companyCard';
import { useNavigate } from 'react-router-dom';
import { getSuppliers } from '../../../api/companyRequest';
import { useCookies } from 'react-cookie';
import { ContactInfoType } from '../types';

export const Contacts: FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);

  const [contactsInfo, setContactsInfo] = useState<ContactInfoType[]>([]);

  useEffect(() => {
    getSuppliers(window.location.hostname, cookies.token)
      .then((response) => {
        console.log('contactsInfo', response.data);
        setContactsInfo(response.data);
      })
      .catch((err) => {
        console.log('setCompanyInfoError', err);
      });
  }, []);

  return (
    <>
      <div className="contacts">
        <div className="cameras__title">
          <h2>Contacts</h2>
          <Button
            text="Add Contact"
            onClick={() => navigate('/company/contacts/newContact')}
            IconLeft={Plus}
          />
        </div>

        <section>
          {contactsInfo.map((item) => {
            return (
              <CompanyCard
                key={item.id}
                title={item.name_company}
                city={item.website}
                email={item.contact_email}
                onClick={() => navigate('/company/contacts/newContact')}
              />
            );
          })}
        </section>
      </div>
    </>
  );
};
