import { SignatureData } from "./signatureStorage";

// Helper to sanitize URLs
const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Add http:// if missing
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// Helper to sanitize user inputs
const sanitize = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

export const generateSignatureHTML = (signature: SignatureData): string => {
  const { personalInfo, socialLinks, branding, cta, settings } = signature.data;
  
  // Generate social icons
  const socialIconsHTML = generateSocialIconsHTML(socialLinks, settings.socialIconStyle);
  
  // Use either new or old property names for backward compatibility
  const logoUrl = branding.logoUrl || branding.logo;
  const primaryColor = branding.brandColor || branding.primaryColor;
  const secondaryColor = branding.textColor || branding.secondaryColor;
  const fontFamily = branding.fontFamily || branding.font;
  const buttonColor = cta.buttonColor || cta.color;
  const ctaTextColor = cta.textColor || '#ffffff';
  
  // Company logo
  const logoHTML = logoUrl ? `<img src="${logoUrl}" alt="${sanitize(personalInfo.company)} logo" style="max-height: 60px; max-width: 180px; margin-bottom: 10px;">` : '';
  
  // Profile photo
  const photoHTML = personalInfo.photoUrl ? 
    `<img src="${personalInfo.photoUrl}" alt="${sanitize(personalInfo.name)}" style="border-radius: 50%; width: 80px; height: 80px; object-fit: cover; ${settings.imagePosition === 'none' ? 'display: none;' : ''}">` : '';
  
  // CTA button
  const ctaHTML = cta.text && cta.url ? `
    <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${buttonColor}; color: ${ctaTextColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-top: 10px; font-family: ${fontFamily};">
      ${sanitize(cta.text)}
    </a>
  ` : '';

  // Different layouts based on settings
  let templateHTML = '';
  
  switch (settings.layout) {
    case 'modern':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          <tr>
            <td style="padding-bottom: 15px;" colspan="2">
              ${logoHTML}
            </td>
          </tr>
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' ? 
              `<td style="padding-right: 15px; vertical-align: middle; ${settings.imagePosition === 'right' ? 'padding-left: 15px; padding-right: 0;' : ''}">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="text-align: center; margin-bottom: 15px;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 18px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 10px; color: ${branding.secondaryColor || '#666'};">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 10px; color: #666;">
                ${personalInfo.email ? `<div>Email: <a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div>Phone: <a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                ${personalInfo.website ? `<div>Website: <a href="${sanitizeUrl(personalInfo.website)}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
                ${personalInfo.address ? `<div>${sanitize(personalInfo.address)}</div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 10px 0; color: #555; font-size: 13px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div>${ctaHTML}</div>
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 15px; vertical-align: middle;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'minimal':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 400px; color: #333333;">
          <tr>
            <td>
              <div style="border-left: 3px solid ${branding.primaryColor}; padding-left: 10px;">
                <div style="margin-bottom: 5px;">
                  <span style="font-weight: bold; font-size: 16px;">${sanitize(personalInfo.name)}</span>
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                  ${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}
                </div>
                <div style="font-size: 12px; margin-bottom: 8px;">
                  ${personalInfo.email ? `<span style="margin-right: 10px;"><a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></span>` : ''}
                  ${personalInfo.phone ? `<span><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></span>` : ''}
                </div>
                ${personalInfo.tagline ? `<div style="font-style: italic; margin: 6px 0; color: #555; font-size: 12px;">${sanitize(personalInfo.tagline)}</div>` : ''}
                <div style="margin-top: 10px;">${socialIconsHTML}</div>
                <div>${ctaHTML}</div>
              </div>
            </td>
          </tr>
        </table>
      `;
      break;
    case 'bold':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 550px; color: white; background-color: ${branding.primaryColor}; padding: 20px; border-radius: 10px;">
          <tr>
            ${settings.imagePosition === 'left' ? 
              `<td style="padding-right: 20px; vertical-align: middle; width: 80px;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="margin-bottom: 15px; text-align: center;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 22px;">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 15px; opacity: 0.9;">
                <span style="font-size: 16px;">${sanitize(personalInfo.title)}</span>
                ${personalInfo.company ? `<br><span style="font-size: 14px;">${sanitize(personalInfo.company)}</span>` : ''}
              </div>
              <div style="font-size: 13px; margin-bottom: 15px;">
                ${personalInfo.email ? `<div><a href="mailto:${personalInfo.email}" style="color: white; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: white; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 10px 0; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
              <div style="margin-top: 15px;">
                ${cta.text && cta.url ? `
                <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: white; color: ${branding.primaryColor}; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-weight: bold;">
                  ${sanitize(cta.text)}
                </a>` : ''}
              </div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 20px; vertical-align: middle; width: 80px;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'hubspot':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #33475b; border: 1px solid #e5e7eb;">
          <tr>
            ${settings.imagePosition !== 'none' && settings.imagePosition !== 'top' && settings.imagePosition !== 'right' ? 
              `<td style="width: 30%; padding: 15px; vertical-align: middle; border-right: 1px solid #e5e7eb; text-align: center;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top; padding: 15px; ${settings.imagePosition === 'none' ? 'width: 100%;' : ''}">
              ${settings.imagePosition === 'top' ? `<div style="text-align: center; margin-bottom: 15px;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 16px; color: #ff7a59;">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 10px; color: #33475b;">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}${personalInfo.company ? ` | ${sanitize(personalInfo.company)}` : ''}</span>
              </div>
              <div style="font-size: 12px; margin-bottom: 10px;">
                ${personalInfo.email ? `<span style="margin-right: 10px;"><a href="mailto:${personalInfo.email}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.email)}</a></span>` : ''}
                ${personalInfo.phone ? `<span><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: #ff7a59; text-decoration: none;">${sanitize(personalInfo.phone)}</a></span>` : ''}
              </div>
              <div style="margin-top: 10px; display: flex; align-items: center;">
                <div>${ctaHTML.replace('background-color', 'background-color: #ff7a59;').replace('margin-top: 10px;', '')}</div>
                <div style="margin-left: 10px;">${socialIconsHTML}</div>
              </div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="width: 30%; padding: 15px; vertical-align: middle; border-left: 1px solid #e5e7eb; text-align: center;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
    case 'compact':
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 400px; color: #333333;">
          <tr>
            <td>
              <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tr>
                    <td style="width: 50%;">
                      <span style="font-weight: bold; font-size: 14px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
                    </td>
                    <td style="width: 50%; text-align: right;">
                      ${cta.text && cta.url ? `
                      <a href="${sanitizeUrl(cta.url)}" style="display: inline-block; background-color: ${cta.color}; color: white; padding: 4px 10px; text-decoration: none; border-radius: 4px; font-family: ${branding.font || 'Arial, sans-serif'}; font-size: 12px;">
                        ${sanitize(cta.text)}
                      </a>` : ''}
                    </td>
                  </tr>
                </table>
              </div>
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td style="width: 70%; font-size: 12px;">
                    ${personalInfo.email ? `<div><a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                    ${personalInfo.phone ? `<div><a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                  </td>
                  <td style="width: 30%; text-align: right;">
                    ${socialIconsHTML}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
      break;
    case 'standard':
    default:
      templateHTML = `
        <table border="0" cellpadding="0" cellspacing="0" style="font-family: ${branding.font || 'Arial, sans-serif'}; max-width: 500px; color: #333333;">
          ${logoHTML ? `<tr><td colspan="3" style="padding-bottom: 10px;">${logoHTML}</td></tr>` : ''}
          <tr>
            ${settings.imagePosition === 'left' ? 
              `<td style="padding-right: 15px; vertical-align: top; width: 80px;">
                ${photoHTML}
              </td>` : ''}
            <td style="vertical-align: top;">
              ${settings.imagePosition === 'top' ? `<div style="margin-bottom: 10px; text-align: center;">${photoHTML}</div>` : ''}
              <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 16px; color: ${branding.primaryColor};">${sanitize(personalInfo.name)}</span>
              </div>
              <div style="margin-bottom: 5px; color: ${branding.secondaryColor || '#666'};">
                <span style="font-size: 14px;">${sanitize(personalInfo.title)}</span>
                ${personalInfo.company ? `<br><span style="font-size: 14px;">${sanitize(personalInfo.company)}</span>` : ''}
              </div>
              <div style="font-size: 12px; margin-bottom: 10px;">
                ${personalInfo.email ? `<div>Email: <a href="mailto:${personalInfo.email}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.email)}</a></div>` : ''}
                ${personalInfo.phone ? `<div>Phone: <a href="tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.phone)}</a></div>` : ''}
                ${personalInfo.website ? `<div>Website: <a href="${sanitizeUrl(personalInfo.website)}" style="color: ${branding.primaryColor}; text-decoration: none;">${sanitize(personalInfo.website)}</a></div>` : ''}
                ${personalInfo.address ? `<div>Address: ${sanitize(personalInfo.address)}</div>` : ''}
              </div>
              ${personalInfo.tagline ? `<div style="font-style: italic; margin: 8px 0; color: #555; font-size: 13px;">"${sanitize(personalInfo.tagline)}"</div>` : ''}
              <div>${ctaHTML}</div>
              <div style="margin-top: 15px;">${socialIconsHTML}</div>
            </td>
            ${settings.imagePosition === 'right' ? 
              `<td style="padding-left: 15px; vertical-align: top; width: 80px;">
                ${photoHTML}
              </td>` : ''}
          </tr>
        </table>
      `;
      break;
  }
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      ${templateHTML}
    </div>
  `;
};

// Generate social media icons based on style - Email-safe version
const generateSocialIconsHTML = (
  socialLinks: Record<string, string | undefined>,
  style: string
): string => {
  if (!socialLinks || Object.keys(socialLinks).filter(key => socialLinks[key]).length === 0) {
    return '';
  }

  // Base64 encoded SVG icons to avoid external dependencies
  const iconData: Record<string, { svg: string, color: string }> = {
    linkedin: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TGlua2VkSW48L3RpdGxlPjxwYXRoIGQ9Ik0yMC40NDcgMjAuNDUyaC0zLjU1NHYtNS41NjljMC0xLjMyOC0uMDI3LTMuMDM3LTEuODUyLTMuMDM3LTEuODUzIDAtMi4xMzYgMS40NDUtMi4xMzYgMi45Mzl2NS42NjdIOS4zNTFWOWgzLjQxNHYxLjU2MWguMDQ2Yy40NzctLjkgMS42MzctMS44NSAzLjM3LTEuODUgMy42MDEgMCA0LjI2NyAyLjM3IDQuMjY3IDUuNDU1djYuMjg2ek01LjMzNyA3LjQzM2MtMS4xNDQgMC0yLjA2My0uOTI2LTIuMDYzLTIuMDY1IDAtMS4xMzguOTItMi4wNjMgMi4wNjUtMi4wNjMgMS4xNCAwIDIuMDY0LjkyNSAyLjA2NCAyLjA2MyAwIDEuMTM5LS45MjUgMi4wNjUtMi4wNjQgMi4wNjV6bTEuNzgyIDEzLjAxOUgzLjU1NVY5aDMuNTY0djExLjQ1MnpNMjIuMjI1IDBIMS43NzFDLjc5MiAwIDAgLjc3NCAwIDEuNzI5djIwLjU0MkMwIDIzLjIyNy43OTIgMjQgMS43NzEgMjRoMjAuNDUxQzIzLjIgMjQgMjQgMjMuMjI3IDI0IDIyLjI3MVYxLjcyOUMyNCAuNzc0IDIzLjIgMCAyMi4yMjIgMGguMDAzeiIvPjwvc3ZnPg==`,
      color: '#0077B5'
    },
    twitter: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+VHdpdHRlcjwvdGl0bGU+PHBhdGggZD0iTTIzLjk1MyA0LjU3YTEwIDEwIDAgMDEtMi44MjUuNzc1IDQuOTU4IDQuOTU4IDAgMDAyLjE2My0yLjcyM2MtLjk1MS41NTUtMi4wMDUuOTU5LTMuMTI3IDEuMTg0YTQuOTIgNC45MiAwIDAwLTguMzg0IDQuNDgyQzcuNjkgOC4wOTUgNC4wNjcgNi4xMyAxLjY0IDMuMTYyYTQuODIyIDQuODIyIDAgMDAtLjY2NiAyLjQ3NWMwIDEuNzEuODcgMy4yMTMgMi4xODggNC4wOTZhNC45MDQgNC45MDQgMCAwMS0yLjIyOC0uNjE2di4wNmE0LjkyMyA0LjkyMyAwIDAwMy45NDYgNC44MjcgNC45OTYgNC45OTYgMCAwMS0yLjIxMi4wODUgNC45MzYgNC45MzYgMCAwMDQuNjA0IDMuNDE3IDkuODY3IDkuODY3IDAgMDEtNi4xMDIgMi4xMDVjLS4zOSAwLS43NzktLjAyMy0xLjE3LS4wNjdhMTMuOTk1IDEzLjk5NSAwIDAwNy41NTcgMi4yMDljOS4wNTMgMCAxMy45OTgtNy40OTYgMTMuOTk4LTEzLjk4NSAwLS4yMSAwLS40Mi0uMDE1LS42M0E5LjkzNSA5LjkzNSAwIDAwMjQgNC41OXoiLz48L3N2Zz4=`,
      color: '#1DA1F2'
    },
    facebook: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+RmFjZWJvb2s8L3RpdGxlPjxwYXRoIGQ9Ik0yNCAxMi4wNzNjMC02LjYyNy01LjM3My0xMi0xMi0xMnMtMTIgNS4zNzMtMTIgMTJjMCA1Ljk5IDQuMzg4IDEwLjk1NCAxMC4xMjUgMTEuODU0di04LjM4NUg3LjA3OHYtMy40N2gzLjA0N1Y5LjQzYzAtMy4wMDcgMS43OTItNC42NjkgNC41MzMtNC42NjkgMS4zMTIgMCAyLjY4Ni4yMzUgMi42ODYuMjM1djIuOTUzSDE1LjgzYy0xLjQ5MSAwLTEuOTU2LjkyNS0xLjk1NiAxLjg3NHYyLjI1aDMuMzI4bC0uNTMyIDMuNDdoLTIuNzk2djguMzg1QzE5LjYxMiAyMy4wMjcgMjQgMTguMDYyIDI0IDEyLjA3M3oiLz48L3N2Zz4=`,
      color: '#1877F2'
    },
    instagram: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+SW5zdGFncmFtPC90aXRsZT48cGF0aCBkPSJNMTIgMEM4LjczNiAwIDguMzMyLjAxIDcuMDUyLjA2IDUuNzc1LjExIDQuOTA1LjI3OCA0LjE0LjUyNSAzLjM1Ljc4NCAyLjY4MiAxLjE1IDIuMDE0IDEuODIgMS4zNDcgMi40OSAuOTggMy4xNTguNzIyIDMuOTQ3LjQ3IDQuNzIuMzAzIDUuNTkuMjUzIDYuODYuMjA0IDguMTUuMiA4LjU0LjIgMTEuODEzcy4wMDQgMy42Ni4wNTUgNC45NDhjLjA1IDEuMjguMjE4IDIuMTQ3LjQ2NSAyLjkxMy4yNi44Ny42MiAxLjUzNyAxLjI5NiAyLjIxNS42NzYuNjc2IDEuMzMgMS4wNCAxLjk5OCAxLjIuNzUyLjI1NSAxLjYuNDI2IDIuOTMuNDggMS4zMjUuMDQgMS43NTQuMDUgNC45NzUuMDVzMy42NTUtLjAxIDQuOTgtLjA1YzEuMzI1LS4wNTUgMi4xODctLjIyNyAyLjkzLS40OC44MDUtLjI1NyAxLjQ3LS42MiAyLjEyOC0xLjI4NS42NTYtLjY1NyAxLjAyLTEuMzI2IDEuMjgtMi4xMjcuMjUzLS43NDQuNDI0LTEuNjE0LjQ4LTIuOTMuMDQ2LTEuMzEzLjA0Ni0xLjcyNi4wNDYtNC45OTQgMC0zLjI2Ni0uMDA4LTMuNjgyLS4wNTYtNS4wMDctLjAyNC0xLjMyLS4yNDUtMi4yLS40NzMtMi45OS0uMjQ2LS43OTUtLjYxLTEuNDgtMS4yNjUtMi4xNC0uNjctLjU4Ny0uMTE1LS4xNzMtLjI3NC0uMzE1LS40ODEtLjQzMnYtLjAyNmMuNDY4LS4xOTEuODE2LS40NC4xLjA0NS0uNzUtLjU0NS0uMjE0LS45ODYuMzk0LTEuNDY0LjExOC0uNzA3LjE3Ny0xLjQ5My4xNzctMi4zNjYgMC0uNTg2LS4wNTItMS4xMjgtLjE1Ny0xLjcyNS0uMTA2LS41OTUtLjI1My0xLjEyNi0uNDQ2LTEuNTk0LS4xOTQtLjQ2Ny0uNDE5LS44NjQtLjY3OS0xLjE5MS0uNTc1LS43MjItMS4zODgtMS4yMzUtMi40MzUtMS41NDN2LS4wNEMtLjA4IDQuMDM5IDEuNjA1IDEuODczIDQuOTk4IDEuNDA2VjEuMzhoLjA0MmMuNDI2LS4wODEuODc5LS4xMjIgMS40MjktLjEyMnptLS40MzcgNS43NDZjLS41IDAtLjkyLjE1NS0xLjI2Ny40NzUtLjM0NS4zMi0uNTU0Ljg0LS42MjggMS41NjlsLS4wMTMuMDY1aDMuNjg5di0uMDUyYzAtLjY2OS0uMTc3LTEuMTYtLjUxNy0xLjQ4NC0uMzQtLjMyNi0uNzU0LS40OTctMS4yNDYtLjQ5N2gtLjAxOHptLjQ0NCA0Ljk4NWMtLjEwNiAwLS4yMDMuMDAzLS4yOTUuMDA2LS4wODkuMDA1LS4xNjYuMDA3LS4yMzMuMDA3SDguNDUxbC4wMTQuMDUzYy4wOS43MzQuMzIgMS4yNTcuNjk0IDEuNTcuMzc1LjMxNC44NTUuNDcxIDEuNDQyLjQ3MS41MzQgMCAuOTctLjE0MiAxLjMyLS40My4zNS0uMjg4LjU2LS43NTUuNjUyLTEuNDIzbC4wMTMtLjA1M2gtMS4wODZsLjAyNi0uMjAxaC0uMDRjMCAuMTMzLS4wNjEuMjAxeiIvPjwvc3ZnPg==`,
      color: '#E4405F'
    },
    github: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViPC90aXRsZT48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+`,
      color: '#181717'
    },
    behance: {
      svg: `PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+QmVoYW5jZTwvdGl0bGU+PHBhdGggZD0iTTE1Ljk5MiAxLjUwN2g0Ljk1MnYxLjM2NWgtNC45NTJ2LTEuMzY1em0tLjc1NSA0Ljk2Yy0uNDkxLS4wMDMtLjkwOC4wNzMtMS4zNS4yMzItLjQ0LjE1OC0uODQuMzk1LTEuMTk0LjcxLS4zNTQuMzE2LS42MzYuNzA3LS44NDUgMS4xNzMtLjIxLjQ2NS0uMzQxLDEuMDAyLS4zNzYgMS42MTRIMTYuN2MtLjA1NS0uNjU2LS4yMS0xLjE0Ny0uNDY1LTEuNDczLS4yNTctLjMyOC0uNjQ0LS40OTUtMS4xNjQtLjUwMiAxLjE2MiAwIDIuMDQ0LS4xMzEgMi42NDQtLjQxMS41OTctLjI2NiAxLjA3OS0uNjkgMS40NC0xLjI4My4zNi0uNTcyLjU0My0xLjI4Mi41NDMtMi4xMzggMC0uNzYzLS4xNi0xLjQxNC0uNDgzLTEuOTM0YS41MS41MSAwIDAwLS4wOS0uMTIxLS4xMi0uMDlhLjMwMy4zMDMgMCAwMS0uMDItLjAzbC4wMi0uMDNjLjE0LjAyNy4wOTgtLjAzIDEuMzUgMS4yMDFoMi4xODRjMS4yOTQgMCAyLjQ0NS0uMTE2IDMuNDQxLS4zNjIuOTkzLS4yNDQgMS44MzItLjYyMyAyLjUxMS0xLjE0OGExOS4yNCAxOS4yNCAwIDAwMS44MjctMS42OGMyLjc0NSAyLjM5MiA2LjUxNiA0LjU2NCAxMC40MDQgMS42NjUtMS44OTcgNC44NzUtMi44Ni03LjUxIDBhMTAuOTEgMTAuOTEgMCAwMC0uNzk4LTIuNjIyYy0uMzQyLS44MjctLjgtMS41NTMtMS4zNzItMi4xODUtLjU3LS42MzEtMS4yNTItMS4xODQtMi4wMy0xLjY2LTEuNDM0LS44Ny0zLjAxLTEuNC00LjcyOS0xLjU4N2wyLjA0LTkuOTcxSDcuNDQzek0zLjYzMiAyLjczNkgwdjExLjljMi42Ni0uNTM4IDQwIOC41MzgtNC04LjI0IDEuMjg0LTEuNzg0IDMuMjI3LTIuMzEgNC44OS0yLjExNCAwLTIuNzEyLTIuMzI1LTIuMjAyIDEuMjU4IDEuOTU2LS4xMTggMS45NTZhMi41MSAyLjUxIDAgMDAyIDUuMzQ1YzEuMTYyIDAgMi4wNDQtLjEzMSAyLjY0NC0uNDExLjU5Ny0uMjY2IDEuMDc5LS42OSAxLjQ0LTEuMjgzLjM2LS41NzIuNTQzLTEuMjgyLjU0My0yLjEzOCAwLS43NjMtLjE2LTEuNDE0LS40ODMtMS45MzRhMi41MSAyLjUxIDAgMDAtLjA5LTEuMjExSDExLjAzOXYtNy43OUgzLjYzMnptLS4xNDIgNC4wNThoLTIuOXY0Ljc1OGgyLjkzOWMxLjAzNCAwIDEuODc2LS4xNDUgMi41MjctLjQ1LjY1LS4zMDEgMS4xNDMtLjgxMyAxLjMxOS0xLjQ4Mi4xNy0uNjUzLjE1Ni0xLjQxNi0uMDUtMS45ODctLjIxNS0uNjA1LS43NDQtMS4wNjQtMS4zOTYtMS4yMjQtMS4wMjMtLjI0Ny0yLjAyLS4xMy0zLjIyMy0uMTN2MS4wNDljMC0uMDM0LTEuMDM0LS4wNzUtMS4wOTYtLjA1Mi0uMDY0LjAyMy0uMTA2LjA1OS0uMTI3LjEwNi0uMDIyLjA0NS0uMDMyLjA4Ny0uMDMyLjEzYS43MS43MSAwIDAwLjAzMi4xMzEuNjkuNjkgMCAwMC4wODYuMTA2Yy4wNDQuMDMzLjA5NS4wNTIuMTQ3LjA1MmwxLjA5LjA1M3YyLjUwM2wtMS4xNjktMi41ODNhLjQ0My40NDMgMCAwMC0uMDY2LS4wOTguMzY1LjM2NSAwIDAwLS4wOTYtLjA2Ni4zMS4zMSAwIDAwLS4xMS0uMDI4LjM0Mi4zNDIgMCAwMC0uMTU3LjA4LjM5Mi4zOTIgMCAwMC0uMTA2LjExM3pNNS4zOTQgNS45MzljLjM3NCAwIC43MTEuMDA0IDEuMDIuMDEyLjMxNC4wMDguNTc1LjAyLjc5My4wMzkuMjMuMDIuNDIuMDQ2LjU3Ny4wNzkuMzQ2LjA3NC42MjIuMjk3LjgyNy42Ny4xOTkuMzU5LjI5NS43OS4yOTUgMS4yOTkgMCAuMzQzLS4wNS42NjEtLjE0OS45NDJhMS40NiAxLjQ2IDAgMDEtLjQyLjY2M2MtLjE3OS4xNjktLjQwMSAzMS4zLS42NjcuNDItLjI1Ny4xMTItLjU2NS4xOTUtLjkyMy4yNDRhMzguNzkgMzguNzkgMCAwMS0xLjM1My4xMzl6TTQuNjkgMTEuMTU4Yy44MjggMCAxLjU3NS4wNDQgMi4yMzMuMTI5LjY1Ny4wOSAxLjIyLjI0NSAxLjY5LjQ5MS40NjguMjUyLjgyOS42LjEuMDk2YTIuMTggMi4xOCAwIDAxLjU5NC45ODhjLjEzNi40MDkuMjA2Ljg5OS4yMDYgMS40NjkgMCAuNzY1LS4xNDUgMS40MjItLjQzOSAxLjk1NmEyLjU2MyAyLjU2MyAwIDAxLTEuMjQgMS4wNmMtLjUyOS4yMjYtMS40NjUuMzEtMi4xMjguMzFIMy40OXYtNi40OTl6TTQuODg4IDEyLjYxNEg0Ljk5NXYzLjU4aC4wNTVjLjQ3NCAwIC45NDItLjAxIDEuMzk4LS4wNDIuNDU5LS4wMy44NzYtLjA5OCAxLjI0NS0uMjA1LjM3NC0uMTA3LjY3LS4yOC44OTItLjUyNi4yMi0uMjQyLjMzLS41OS4zMy0xLjA0MyAwLS4zNS0uMDc5LS42NDUtLjIzNS0uODg0LS4xNTktLjIzOS0uMzkyLS40Mi0uNzA0LS41NDQtLjMxMy0uMTI1LS43MDUtLjIwNS0xLjE5NC0uMjQ1LS40ODktLjA0LTEuMDM1LS4wNjItMS42NC0uMDYydi4wM3ptNi4xNjktNS44MzhoNy4zNDZWOC4wNzZoLTcuMzQ2em0tLjA2MyA4LjAzaDcuNjU0djEuMzAzaC03LjY1NHYtMS4zMDN6bS43NTYtNi40MTNjMS4zODYgMCAyLjQ4OS4zOTcgMy4zMDYgMS4xOTIuODE3Ljc5NiAxLjIyNiAxLjgxIDEuMjI2IDMuMDQzIDAgLjg2MS0uMTgxIDEuNTgxLS41NDQgMi4xNWExLjUyIDEuNTIgMCAwMS0xLjMzNC43MjZjLjQ1OS4yMDQuNzkzLjUzNiAxLjAwOCAxIC4yMTIuNDYyLjMxOCAxLjAwMy4zMTggMS42NDVhNy45NzMgNy45NzMgMCAwMS0uMTM4IDEuNWMtLjA5NC41LS4yMzIuOTUzLS40MjEgMS4zNDQtLjE4OC4zOTItLjQxOS43MjktLjY5MiAxLS4zNDQuMzQtLjczLjU5LTEuMTU1Ljc0LS40MjYuMTUyLS44ODguMjUtMS4zOC4zLTQuODIyLjQ4Ny01LjQzOC4yOTYtNy4xMzQtLjQ4M2EyLjI1IDIuMjUgMCAwMS0uNzgyLTEuNjY0Yy0uMDM0LS4yNDgtLjA1MS0uNjItLjA1MS0xLjExMS4wMDEtLjQwNS0uMDEzLS43MS0uMDQtLjkyNC0uMDIyLS4yMS0uMDYyLS40MjItLjExOS0uNjQzLS4wNTgtLjIxNy0uMTQzLS40MS0uMjYtLjU4Ny0uMTE1LS4xNzMtLjI3NC0uMzE1LS40ODEtLjQzMnYtLjAyNmMuNDY4LS4xOTEuODE2
