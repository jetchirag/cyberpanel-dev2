import os,sys
sys.path.append('/usr/local/CyberCP')
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CyberCP.settings")
django.setup()
import os.path
import shutil
import CyberCPLogFileWriter as logging
import subprocess
import argparse
import shlex
from mailServer.models import Domains,EUsers
from emailPremium.models import DomainLimits, EmailLimits
from websiteFunctions.models import Websites
from processUtilities import ProcessUtilities


class mailUtilities:

    installLogPath = "/home/cyberpanel/openDKIMInstallLog"
    spamassassinInstallLogPath = "/home/cyberpanel/spamassassinInstallLogPath"
    cyberPanelHome = "/home/cyberpanel"

    @staticmethod
    def createEmailAccount(domain, userName, password):
        try:

            ## Check if already exists

            finalEmailUsername = userName + "@" + domain

            if EUsers.objects.filter(email=finalEmailUsername).exists():
                raise BaseException("This account already exists!")

            ## Check for email limits.

            website = Websites.objects.get(domain=domain)

            try:

                if not Domains.objects.filter(domain=domain).exists():
                    newEmailDomain = Domains(domainOwner=website, domain=domain)
                    newEmailDomain.save()

                if not DomainLimits.objects.filter(domain=newEmailDomain).exists():
                    domainLimits = DomainLimits(domain=newEmailDomain)
                    domainLimits.save()

                if website.package.emailAccounts == 0 or (
                            newEmailDomain.eusers_set.all().count() < website.package.emailAccounts):
                    pass
                else:
                    raise BaseException("Exceeded maximum amount of email accounts allowed for the package.")

            except:

                emailDomain = Domains.objects.get(domain=domain)

                if website.package.emailAccounts == 0 or (
                            emailDomain.eusers_set.all().count() < website.package.emailAccounts):
                    pass
                else:
                    raise BaseException("Exceeded maximum amount of email accounts allowed for the package.")


            ## After effects


            path = "/usr/local/CyberCP/install/rainloop/cyberpanel.net.ini"

            if not os.path.exists("/usr/local/lscp/cyberpanel/rainloop/data/_data_/_default_/domains/"):
                os.makedirs("/usr/local/lscp/cyberpanel/rainloop/data/_data_/_default_/domains/")

            finalPath = "/usr/local/lscp/cyberpanel/rainloop/data/_data_/_default_/domains/" + domain + ".ini"

            if not os.path.exists(finalPath):
                shutil.copy(path, finalPath)

            command = 'chown -R lscpd:lscpd /usr/local/lscp/cyberpanel/rainloop'

            cmd = shlex.split(command)

            res = subprocess.call(cmd)

            command = 'chown -R lscpd:lscpd /usr/local/lscp/cyberpanel/rainloop/data/_data_'

            cmd = shlex.split(command)

            res = subprocess.call(cmd)

            ## After effects ends

            emailDomain = Domains.objects.get(domain=domain)

            emailAcct = EUsers(emailOwner=emailDomain, email=finalEmailUsername, password=password)
            emailAcct.save()

            emailLimits = EmailLimits(email=emailAcct)
            emailLimits.save()

            print "1,None"
            return 1,"None"

        except BaseException,msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [createEmailAccount]")
            print "0," + str(msg)
            return 0, str(msg)

    @staticmethod
    def deleteEmailAccount(email):
        try:

            email = EUsers(email=email)
            email.delete()

            return 1, 'None'

        except BaseException, msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [deleteEmailAccount]")
            return 0, str(msg)

    @staticmethod
    def getEmailAccounts(virtualHostName):
        try:
            emailDomain = Domains.objects.get(domain=virtualHostName)
            return emailDomain.eusers_set.all()
        except:
            return 0

    @staticmethod
    def changeEmailPassword(email, newPassword):
        try:
            changePass = EUsers.objects.get(email=email)
            changePass.password = newPassword
            changePass.save()
            return 0,'None'
        except BaseException, msg:
            return 0, str(msg)

    @staticmethod
    def setupDKIM(virtualHostName):
        try:
            ## Generate DKIM Keys

            import tldextract

            #extractDomain = tldextract.extract(virtualHostName)
            #virtualHostName = extractDomain.domain + '.' + extractDomain.suffix

            if os.path.exists("/etc/opendkim/keys/" + virtualHostName):
                return 1, "None"

            os.mkdir("/etc/opendkim/keys/" + virtualHostName)

            ## Generate keys

            FNULL = open(os.devnull, 'w')

            command = "opendkim-genkey -D /etc/opendkim/keys/" + virtualHostName + " -d " + virtualHostName + " -s default"
            subprocess.call(shlex.split(command),stdout=FNULL, stderr=subprocess.STDOUT)

            ## Fix permissions

            command = "chown -R root:opendkim /etc/opendkim/keys/" + virtualHostName
            subprocess.call(shlex.split(command))

            command = "chmod 640 /etc/opendkim/keys/" + virtualHostName + "/default.private"
            subprocess.call(shlex.split(command))

            command = "chmod 644 /etc/opendkim/keys/" + virtualHostName + "/default.txt"
            subprocess.call(shlex.split(command))

            ## Edit key file

            keyTable = "/etc/opendkim/KeyTable"
            configToWrite = "default._domainkey." + virtualHostName + " " + virtualHostName + ":default:/etc/opendkim/keys/" + virtualHostName + "/default.private\n"

            writeToFile = open(keyTable, 'a')
            writeToFile.write(configToWrite)
            writeToFile.close()

            ## Edit signing table

            signingTable = "/etc/opendkim/SigningTable"
            configToWrite = "*@" + virtualHostName + " default._domainkey." + virtualHostName + "\n"

            writeToFile = open(signingTable, 'a')
            writeToFile.write(configToWrite)
            writeToFile.close()

            ## Trusted hosts

            trustedHosts = "/etc/opendkim/TrustedHosts"
            configToWrite = virtualHostName + "\n"

            writeToFile = open(trustedHosts, 'a')
            writeToFile.write(configToWrite)
            writeToFile.close()

            ## Restart postfix and OpenDKIM

            command = "systemctl restart opendkim"
            subprocess.call(shlex.split(command))

            command = "systemctl restart postfix"
            subprocess.call(shlex.split(command))

            return 1, "None"

        except BaseException, msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [setupDKIM]")
            return 0, str(msg)

    @staticmethod
    def checkIfDKIMInstalled():
        try:

            path = "/etc/opendkim.conf"

            command = "sudo cat " + path
            res = subprocess.call(shlex.split(command))

            if res == 1:
                return 0
            else:
                return 1

        except BaseException, msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [checkIfDKIMInstalled]")
            return 0

    @staticmethod
    def generateKeys(domain):
        try:
            result = mailUtilities.setupDKIM(domain)
            if result[0] == 0:
                raise BaseException(result[1])
            else:
                print "1,None"

        except BaseException,msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [generateKeys]")
            print "0," + str(msg)

    @staticmethod
    def configureOpenDKIM():
            try:

                ## Configure OpenDKIM specific settings

                openDKIMConfigurePath = "/etc/opendkim.conf"

                configData = """
Mode	sv
Canonicalization	relaxed/simple
KeyTable	refile:/etc/opendkim/KeyTable
SigningTable	refile:/etc/opendkim/SigningTable
ExternalIgnoreList	refile:/etc/opendkim/TrustedHosts
InternalHosts	refile:/etc/opendkim/TrustedHosts
"""

                writeToFile = open(openDKIMConfigurePath, 'a')
                writeToFile.write(configData)
                writeToFile.close()

                ## Configure postfix specific settings

                postfixFilePath = "/etc/postfix/main.cf"

                configData = """
smtpd_milters = inet:127.0.0.1:8891
non_smtpd_milters = $smtpd_milters
milter_default_action = accept
"""

                writeToFile = open(postfixFilePath, 'a')
                writeToFile.write(configData)
                writeToFile.close()

                #### Restarting Postfix and OpenDKIM

                command = "systemctl start opendkim"
                subprocess.call(shlex.split(command))

                command = "systemctl enable opendkim"
                subprocess.call(shlex.split(command))

                ##

                command = "systemctl start postfix"
                subprocess.call(shlex.split(command))

                print "1,None"
                return



            except OSError, msg:
                logging.CyberCPLogFileWriter.writeToFile(str(msg) + " [configureOpenDKIM]")
                print "0," + str(msg)
                return
            except BaseException, msg:
                logging.CyberCPLogFileWriter.writeToFile(str(msg) + " [configureOpenDKIM]")
                print "0," + str(msg)
            return

    @staticmethod
    def checkHome():
        try:
            try:
                FNULL = open(os.devnull, 'w')

                command = "sudo mkdir " + mailUtilities.cyberPanelHome
                subprocess.call(shlex.split(command), stdout=FNULL)

                command = "sudo chown -R cyberpanel:cyberpanel " + mailUtilities.cyberPanelHome
                subprocess.call(shlex.split(command), stdout=FNULL)
            except:
                command = "sudo chown -R cyberpanel:cyberpanel " + mailUtilities.cyberPanelHome
                subprocess.call(shlex.split(command), stdout=FNULL)

        except BaseException,msg:
            logging.CyberCPLogFileWriter.writeToFile(str(msg) + " [checkHome]")

    @staticmethod
    def installOpenDKIM(install, openDKIMINstall):
        try:

            mailUtilities.checkHome()

            command = 'sudo yum install opendkim -y'

            cmd = shlex.split(command)

            with open(mailUtilities.installLogPath, 'w') as f:
                res = subprocess.call(cmd, stdout=f)

            if res == 1:
                writeToFile = open(mailUtilities.installLogPath, 'a')
                writeToFile.writelines("Can not be installed.[404]\n")
                writeToFile.close()
                logging.CyberCPLogFileWriter.writeToFile("[Could not Install OpenDKIM.]")
                return 0
            else:
                writeToFile = open(mailUtilities.installLogPath, 'a')
                writeToFile.writelines("OpenDKIM Installed.[200]\n")
                writeToFile.close()

            return 1
        except BaseException, msg:
            writeToFile = open(mailUtilities.installLogPath, 'a')
            writeToFile.writelines("Can not be installed.[404]\n")
            writeToFile.close()
            logging.CyberCPLogFileWriter.writeToFile(str(msg) + "[installOpenDKIM]")

    @staticmethod
    def restartServices():
        try:
            command = 'systemctl restart postfix'
            subprocess.call(shlex.split(command))

            command = 'systemctl restart dovecot'
            subprocess.call(shlex.split(command))
        except BaseException,msg:
            logging.CyberCPLogFileWriter.writeToFile(str(msg) + " [restartServices]")

    @staticmethod
    def installSpamAssassin(install, SpamAssassin):
        try:

            mailUtilities.checkHome()

            if ProcessUtilities.decideDistro() == ProcessUtilities.centos:
                command = 'sudo yum install spamassassin -y'
            else:
                command = 'sudo apt-get install spamassassin spamc -y'

            cmd = shlex.split(command)

            with open(mailUtilities.spamassassinInstallLogPath, 'w') as f:
                res = subprocess.call(cmd, stdout=f)

            if res == 1:
                writeToFile = open(mailUtilities.spamassassinInstallLogPath, 'a')
                writeToFile.writelines("Can not be installed.[404]\n")
                writeToFile.close()
                logging.CyberCPLogFileWriter.writeToFile("[Could not Install SpamAssassin.]")
                return 0
            else:
                writeToFile = open(mailUtilities.spamassassinInstallLogPath, 'a')
                writeToFile.writelines("SpamAssassin Installed.[200]\n")
                writeToFile.close()

            return 1
        except BaseException, msg:
            writeToFile = open(mailUtilities.spamassassinInstallLogPath, 'a')
            writeToFile.writelines("Can not be installed.[404]\n")
            writeToFile.close()
            logging.CyberCPLogFileWriter.writeToFile(str(msg) + "[installSpamAssassin]")

    @staticmethod
    def checkIfSpamAssassinInstalled():
        try:

            path = "/etc/mail/spamassassin/local.cf"

            command = "sudo cat " + path
            res = subprocess.call(shlex.split(command))

            if res == 1:
                return 0
            else:
                return 1

        except BaseException, msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [checkIfSpamAssassinInstalled]")
            return 0

    @staticmethod
    def configureSpamAssassin():
        try:

            if ProcessUtilities.decideDistro() == ProcessUtilities.ubuntu:
                confFile = "/etc/mail/spamassassin/local.cf"
                confData = open(confFile).readlines()

                conf = open(confFile, 'w')

                for items in confData:
                    if items.find('report_safe') > -1 or items.find('rewrite_header') > -1 or items.find('required_score') > -1 or items.find('required_hits') > -1:
                        conf.write(items.strip('#').strip(' '))
                    else:
                        conf.write(items)

                conf.close()


            command = "groupadd spamd"
            subprocess.call(shlex.split(command))

            command = "useradd -g spamd -s /bin/false -d /var/log/spamassassin spamd"
            subprocess.call(shlex.split(command))

            ##

            command = "chown spamd:spamd /var/log/spamassassin"
            subprocess.call(shlex.split(command))

            command = "systemctl enable spamassassin"
            subprocess.call(shlex.split(command))

            command = "systemctl start spamassassin"
            subprocess.call(shlex.split(command))

            ## Configuration to postfix

            postfixConf = '/etc/postfix/master.cf'
            data = open(postfixConf, 'r').readlines()

            writeToFile = open(postfixConf, 'w')
            checker = 1

            for items in data:
                if items.find('smtp') > - 1 and items.find('inet') > - 1 and items.find('smtpd') > - 1 and checker == 1:
                    writeToFile.writelines(items.strip('\n') + ' -o content_filter=spamassassin\n')
                    checker = 0
                else:
                    writeToFile.writelines(items)

            writeToFile.writelines('spamassassin unix - n n - - pipe flags=R user=spamd argv=/usr/bin/spamc -e /usr/sbin/sendmail -oi -f ${sender} ${recipient}')
            writeToFile.close()

            command = 'systemctl restart postfix'
            subprocess.call(shlex.split(command))


            print "1,None"
            return


        except OSError, msg:
            logging.CyberCPLogFileWriter.writeToFile(str(msg) + " [configureSpamAssassin]")
            print "0," + str(msg)
            return
        except BaseException, msg:
            logging.CyberCPLogFileWriter.writeToFile(str(msg) + " [configureSpamAssassin]")
            print "0," + str(msg)
        return

    @staticmethod
    def saveSpamAssassinConfigs(tempConfigPath):
        try:

            data = open(tempConfigPath).readlines()
            os.remove(tempConfigPath)

            confFile = "/etc/mail/spamassassin/local.cf"
            confData = open(confFile).readlines()

            conf = open(confFile, 'w')

            rsCheck = 0

            for items in confData:

                if items.find('report_safe ') > -1:
                    conf.writelines(data[0])
                    continue
                elif items.find('required_hits ') > -1:
                    conf.writelines(data[1])
                    continue
                elif items.find('rewrite_header ') > -1:
                    conf.writelines(data[2])
                    continue
                elif items.find('required_score ') > -1:
                    conf.writelines(data[3])
                    rsCheck = 1
                    continue

            if rsCheck == 0:
                conf.writelines(data[3])


            conf.close()

            command = 'systemctl restart spamassassin'
            subprocess.call(shlex.split(command))

            print "1,None"
            return

        except BaseException, msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [saveSpamAssassinConfigs]")
            print "0," + str(msg)

    @staticmethod
    def savePolicyServerStatus(install):
        try:

            postfixPath = '/etc/postfix/main.cf'

            if install == '1':
                if not os.path.exists('/etc/systemd/system/cpecs.service'):
                    shutil.copy("/usr/local/CyberCP/postfixSenderPolicy/cpecs.service", "/etc/systemd/system/cpecs.service")

                command = 'systemctl enable cpecs'
                subprocess.call(shlex.split(command))

                command = 'systemctl start cpecs'
                subprocess.call(shlex.split(command))

                writeToFile = open(postfixPath, 'a')
                writeToFile.writelines('smtpd_data_restrictions = check_policy_service unix:/var/log/policyServerSocket\n')
                writeToFile.writelines('smtpd_policy_service_default_action = DUNNO\n')
                writeToFile.close()

                command = 'systemctl restart postfix'
                subprocess.call(shlex.split(command))
            else:

                data = open(postfixPath, 'r').readlines()
                writeToFile = open(postfixPath, 'w')

                for items in data:
                    if items.find('check_policy_service unix:/var/log/policyServerSocket') > -1:
                        continue
                    elif items.find('smtpd_policy_service_default_action = DUNNO') > -1:
                        continue
                    else:
                        writeToFile.writelines(items)

                writeToFile.close()

                command = 'systemctl stop cpecs'
                subprocess.call(shlex.split(command))

                command = 'systemctl restart postfix'
                subprocess.call(shlex.split(command))

            print "1,None"
            return

        except BaseException, msg:
            logging.CyberCPLogFileWriter.writeToFile(
                str(msg) + "  [savePolicyServerStatus]")
            print "0," + str(msg)


def main():

    parser = argparse.ArgumentParser(description='CyberPanel Installer')
    parser.add_argument('function', help='Specific a function to call!')
    parser.add_argument('--domain', help='Domain name!')
    parser.add_argument('--userName', help='Email Username!')
    parser.add_argument('--password', help='Email password!')
    parser.add_argument('--tempConfigPath', help='Temporary Configuration Path!')
    parser.add_argument('--install', help='Enable/Disable Policy Server!')



    args = parser.parse_args()

    if args.function == "createEmailAccount":
        mailUtilities.createEmailAccount(args.domain, args.userName, args.password)
    elif args.function == "generateKeys":
        mailUtilities.generateKeys(args.domain)
    elif args.function == "configureOpenDKIM":
        mailUtilities.configureOpenDKIM()
    elif args.function == "configureSpamAssassin":
        mailUtilities.configureSpamAssassin()
    elif args.function == "saveSpamAssassinConfigs":
        mailUtilities.saveSpamAssassinConfigs(args.tempConfigPath)
    elif args.function == 'savePolicyServerStatus':
        mailUtilities.savePolicyServerStatus(args.install)

if __name__ == "__main__":
    main()